import * as grpc from "@grpc/grpc-js";
import logger from "./logger";

import {
  FunctionRunnerServiceService,
  type RunFunctionRequest,
  type RunFunctionResponse,
  type FunctionRunnerServiceServer,
} from "./gen/proto/run_function";

import { Entrypoint } from './interfaces'


const entrypoints: Entrypoint[] = [];
let instance: unknown = null;

// Store the runtime instance so handlers run with the correct `this` context.
function setHandlerInstance(inst: unknown): void {
  instance = inst;
}

function Handler(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    if (typeof descriptor.value === "function") {
      const fn = descriptor.value as Entrypoint;
      entrypoints.push(fn);
    }
  };
}

export function runEntrypoints(): void {
  entrypoints.forEach((fn) => fn.call(instance));
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

export { FunctionRunnerServiceService, Handler };
export { grpcHandler, setHandlerInstance };
