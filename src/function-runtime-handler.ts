import * as grpc from "@grpc/grpc-js";

import logger from "./logger";

import {
  FunctionRunnerServiceService,
  type RunFunctionRequest,
  type RunFunctionResponse,
  type FunctionRunnerServiceServer,
} from "./gen/proto/run_function";

const handler: FunctionRunnerServiceServer["runFunction"] = (
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

  callback(null, response);
};

export { FunctionRunnerServiceService, handler };
