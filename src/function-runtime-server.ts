import * as grpc from '@grpc/grpc-js';

import { FunctionRunnerServiceService, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';

import config from './config';
import logger from './logger';

import { runEntrypoints } from './function-runtime-handler';

export class FunctionRuntimeServer {
  private server: grpc.Server;

  constructor(private readonly handlerContext: unknown) {
    this.server = new grpc.Server();
    this.server.addService(FunctionRunnerServiceService, {
      runFunction: this.runFunction.bind(this)
    });

    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.once(signal, () => this.gracefulShutdown(signal));
    });
  }

  private runFunction(call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>, callback: grpc.sendUnaryData<RunFunctionResponse>): void {
    logger.info('Running Function');

    const response: RunFunctionResponse = {
      context: call.request.context,
      desired: call.request.desired,
      results: [],
      conditions: []
    };

    try {
      runEntrypoints(this.handlerContext);
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

  public start(): void {
    this.server.bindAsync(config.grpc.url, grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        logger.error(`Failed to bind server: ${error}`);
        process.exit(1);
      }
      logger.info('Function Started');
      logger.debug(`gRPC server listening on port ${port}`);
    });
  }
}
