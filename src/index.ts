import { FunctionRuntime } from './function-runtime';


function main(): void {
  new FunctionRuntime();
}
main();

// @FunctionRunner()
// function main(): void {

// }


// import * as grpc from "@grpc/grpc-js";

// import config from "./config";
// import logger from "./logger";

// import {
//   FunctionRunnerServiceService,
//   Ready,
//   Resource,
//   type RunFunctionRequest,
//   type RunFunctionResponse,
//   type FunctionRunnerServiceServer,
//   type State,
// } from "./gen/proto/run_function";

// const runFunction: FunctionRunnerServiceServer["runFunction"] = (
//   call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>,
//   callback: grpc.sendUnaryData<RunFunctionResponse>,
// ): void => {
//   const desired: State = call.request.desired || { resources: {} };

//   const newResource: Resource = {
//     resource: {
//       apiVersion: "v1",
//       kind: "ExampleResource",
//       metadata: {
//         name: "example-resource",
//       },
//       spec: {
//         exampleField: "exampleValue",
//       },
//     },
//     connectionDetails: {},
//     ready: Ready.READY_TRUE,
//   };

//   desired.resources.example = newResource;

//   const response: RunFunctionResponse = {
//     context: call.request.context || {},
//     desired,
//     results: [],
//     conditions: [],
//   };

//   response.requirements = {
//     resources: {
//       config: {
//         apiVersion: "v1",
//         kind: "ConfigMap",
//         matchName: "simple-config2",
//       },
//     },
//     extraResources: {},
//   };

//   const t = call.request.requiredResources?.config?.items[0]?.resource;
//   logger.info(`Requiring resource: ${t?.apiVersion} ${t?.kind} ${t?.matchName}`);

//   logger.info("Running Function");
//   callback(null, response);
// };

// function gracefulShutdown(signal: string, server: grpc.Server): void {
//   const timeout = setTimeout(() => {
//     logger.warn("Graceful shutdown timed out, forcing exit...");
//     process.exit(1);
//   }, config.grpc.shutdownTimeout);

//   logger.info(`Received ${signal}, shutting down...`);
//   server.tryShutdown((err) => {
//     clearTimeout(timeout);

//     if (err) {
//       logger.error(`Error during shutdown: ${err}`);
//       process.exit(1);
//     }
//     process.exit(0);
//   });
// }

// function main(): void {
//   const server = new grpc.Server();

//   ["SIGINT", "SIGTERM"].forEach((signal) => {
//     process.once(signal, () => gracefulShutdown(signal, server));
//   });

//   server.addService(FunctionRunnerServiceService, { runFunction });

//   server.bindAsync(
//     config.grpc.url,
//     grpc.ServerCredentials.createInsecure(),
//     (error, port) => {
//       if (error) {
//         logger.error(`Failed to bind server: ${error}`);
//         process.exit(1);
//       }
//       logger.info("Function Started");
//       logger.debug(`gRPC server listening on port ${port}`);
//     },
//   );
// }

// main();
