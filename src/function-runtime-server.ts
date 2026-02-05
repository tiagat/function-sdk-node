import * as grpc from "@grpc/grpc-js";

import {
  FunctionRunnerServiceService,
  handler,
} from "./function-runtime-handler";

import config from "./config";
import logger from "./logger";

const signals = ["SIGINT", "SIGTERM"];

export class FunctionRuntimeServer {
  private server: grpc.Server;

  constructor() {
    this.server = new grpc.Server();
    this.server.addService(FunctionRunnerServiceService, { runFunction: handler });
    
    signals.forEach((signal) => {
      process.once(signal, () => this.gracefulShutdown(signal));
    });
  }

  private gracefulShutdown(signal: string): void {
    const timeout = setTimeout(() => {
      logger.warn("Graceful shutdown timed out, forcing exit...");
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
    this.server.bindAsync(
      config.grpc.url,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          logger.error(`Failed to bind server: ${error}`);
          process.exit(1);
        }
        logger.info("Function Started");
        logger.debug(`gRPC server listening on port ${port}`);
      },
    );
  }
}
