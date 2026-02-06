import * as grpc from "@grpc/grpc-js";

import logger from "./logger";

import {
  FunctionRunnerServiceService,
  type RunFunctionRequest,
  type RunFunctionResponse,
  type FunctionRunnerServiceServer,
} from "./gen/proto/run_function";


type Entrypoint = () => void;

const entrypoints: Entrypoint[] = [];

function Handler(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    if (typeof descriptor.value === "function") {
      entrypoints.push(descriptor.value as Entrypoint);
    }
  };
}

export function runEntrypoints(): void {
  entrypoints.forEach((fn) => fn());
}


const grpcHandler: FunctionRunnerServiceServer["runFunction"] = (
  call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>,
  callback: grpc.sendUnaryData<RunFunctionResponse>,
): void => {
  
  logger.info("Running Function");
  const response: RunFunctionResponse = {
    context: call.request.context,
    desired: call.request.desired,
    results: [],
    conditions: [],
  };

  runEntrypoints();

  callback(null, response);
};

export { FunctionRunnerServiceService, grpcHandler, Handler };
