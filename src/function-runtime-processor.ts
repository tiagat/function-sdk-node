import * as grpc from '@grpc/grpc-js';
import { RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';

import { RuntimeFunctionHandlerContext } from './function-runtime-handler';
import { EntrypointFunction } from './entrypoints';

type PublicMethodNames<T> = {
  [K in keyof T]: T[K] extends EntrypointFunction ? K : never;
}[keyof T];

type RuntimeFunctionProcessorMethod = PublicMethodNames<FunctionRuntimeProcessor>;

class FunctionRuntimeProcessor {
  private readonly call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>;
  private readonly callback: grpc.sendUnaryData<RunFunctionResponse>;
  private readonly response: RunFunctionResponse;

  constructor(context: RuntimeFunctionHandlerContext) {
    this.call = context.call;
    this.callback = context.callback;
    this.response = {
      context: this.call.request.context,
      desired: this.call.request.desired,
      results: [],
      conditions: []
    };
  }

  getCall(): grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse> {
    return this.call;
  }

  getCallback(): grpc.sendUnaryData<RunFunctionResponse> {
    return this.callback;
  }

  getReq(): RunFunctionRequest {
    return this.call.request;
  }

  getRes(): RunFunctionResponse {
    return this.response;
  }
}

export { FunctionRuntimeProcessor, RuntimeFunctionProcessorMethod };
