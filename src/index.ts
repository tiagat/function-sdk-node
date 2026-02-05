import * as grpc from "@grpc/grpc-js";
import logger from "./logger";

import config from "./config";
import {
  FunctionRunnerService,
  RunFunctionResponse,
} from "./gen/run_function_pb";

function runFunction(call: any, callback: any): void {
  const response: RunFunctionResponse = {
    $typeName: "apiextensions.fn.proto.v1.RunFunctionResponse",
    results: [],
    conditions: [],
  };
  callback(null, response);
}

function gracefulShutdown(signal: string, server: grpc.Server): void {
  logger.info(`Received ${signal}, shutting down...`);
  const timeout = setTimeout(() => {
    logger.warn("Graceful shutdown timed out, forcing exit...");
    process.exit(1);
  }, config.grpc.shutdownTimeout);

  server.tryShutdown((err) => {
    clearTimeout(timeout);

    if (err) {
      logger.error(`Error during shutdown: ${err}`);
      process.exit(1);
    }
    process.exit(0);
  });
}

function main(): void {
  const server = new grpc.Server();

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.once(signal, () => gracefulShutdown(signal, server));
  });

  server.addService(FunctionRunnerService, { runFunction: runFunction });

  server.bindAsync(
    config.grpc.url,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error(`Failed to bind server: ${error}`);
        process.exit(1);
      }

      logger.info(`gRPC server listening on port ${port}`);
    },
  );
}

main();
