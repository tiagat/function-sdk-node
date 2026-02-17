import * as grpc from '@grpc/grpc-js';
import * as fs from 'fs';
import * as path from 'path';

import { FunctionRunnerServiceService, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';

import config from './config';
import logger from './logger';

import { RuntimeFunctionHandlerContext, RuntimeFunctionHandler } from './function-runtime-handler';

export class FunctionRuntimeServer {
  private server: grpc.Server;

  constructor(private readonly functionContext: unknown) {
    this.server = new grpc.Server();
    this.server.addService(FunctionRunnerServiceService, {
      runFunction: this.runFunction.bind(this)
    });

    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.once(signal, () => this.gracefulShutdown(signal));
    });
  }

  private async runFunction(
    call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>,
    callback: grpc.sendUnaryData<RunFunctionResponse>
  ): Promise<void> {
    logger.info('Running Function');
    try {
      const handlerContext: RuntimeFunctionHandlerContext = {
        call,
        callback,
        functionContext: this.functionContext
      };
      const handler = new RuntimeFunctionHandler(handlerContext);
      const response = await handler.runEntrypoints();
      callback(null, response);
    } catch (err) {
      logger.error({ err }, 'Error running function');
      callback({ code: grpc.status.INTERNAL, details: String(err) }, null);
    }
  }

  private gracefulShutdown(signal: string): void {
    const timeout = setTimeout(() => {
      logger.warn('Graceful shutdown timed out, forcing exit...');
      process.exit(1);
    }, config.grpc.shutdownTimeout);

    logger.info(`Received ${signal}, shutting down...`);
    this.server.tryShutdown((err) => {
      clearTimeout(timeout);

      if (err) {
        logger.error(`Error during shutdown: ${err}`);
        process.exit(1);
      }
      process.exit(0);
    });
  }

  private getServerCredentials(certDir: string): grpc.ServerCredentials {
    const caCert = fs.readFileSync(path.join(certDir, 'ca.crt'));
    const serverCert = fs.readFileSync(path.join(certDir, 'tls.crt'));
    const serverKey = fs.readFileSync(path.join(certDir, 'tls.key'));

    return grpc.ServerCredentials.createSsl(
      caCert,
      [
        {
          private_key: serverKey,
          cert_chain: serverCert
        }
      ],
      config.grpc.checkClientCertificate
    );
  }

  public start(): void {
    const credentials = config.grpc.tlsCertsDir
      ? this.getServerCredentials(config.grpc.tlsCertsDir)
      : grpc.ServerCredentials.createInsecure();
    this.server.bindAsync(config.grpc.url, credentials, (error, port) => {
      if (error) {
        logger.error(`Failed to bind server: ${error}`);
        process.exit(1);
      }
      logger.info('Function Started');
      logger.debug(`gRPC server listening on port ${port}`);
    });
  }
}
