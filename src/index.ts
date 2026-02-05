import * as grpc from "@grpc/grpc-js";

import config from "./config";
import logger from "./logger";

import {
  FunctionRunnerServiceService,
  type RunFunctionRequest,
  type RunFunctionResponse,
  type FunctionRunnerServiceServer,
} from "./gen/proto/run_function";

const runFunction: FunctionRunnerServiceServer["runFunction"] = (
  call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>,
  callback: grpc.sendUnaryData<RunFunctionResponse>,
): void => {
  const response: RunFunctionResponse = {
    context: call.request.context,
    desired: call.request.desired,
    results: [],
    conditions: [],
  };


  callback(null, response);
};

function gracefulShutdown(signal: string, server: grpc.Server): void {
  const timeout = setTimeout(() => {
    logger.warn("Graceful shutdown timed out, forcing exit...");
    process.exit(1);
  }, config.grpc.shutdownTimeout);
  
  logger.info(`Received ${signal}, shutting down...`);
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

  server.addService(FunctionRunnerServiceService, { runFunction });

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
