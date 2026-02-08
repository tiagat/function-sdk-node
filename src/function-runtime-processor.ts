import * as grpc from '@grpc/grpc-js';
import { Resource, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';

import { Context, Environment } from './interfaces';
import { RuntimeFunctionHandlerContext } from './function-runtime-handler';
import { EntrypointFunction } from './entrypoints';

import { ENVIRONMENT_CONFIG_KEY } from './constants';

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

  getRequest(): RunFunctionRequest {
    return this.call.request;
  }

  getResponse(): RunFunctionResponse {
    return this.response;
  }

  getContext(): Context {
    if (!this.call.request.context) {
      this.call.request.context = {
        [ENVIRONMENT_CONFIG_KEY]: {}
      };
    }
    return this.call.request.context;
  }

  getEnvironment(): Environment {
    if (!this.call.request.context) {
      this.call.request.context = {
        [ENVIRONMENT_CONFIG_KEY]: {}
      };
    }
    return this.call.request.context[ENVIRONMENT_CONFIG_KEY];
  }

  getComposite(): Resource | undefined {
    return this.call.request.observed?.composite;
  }

  // getObserved(name: string): Resource[] | undefined {
  //   return undefined;
  // }

  // getRequired(name: string): Resource[] | undefined {
  //   return undefined;
  // }
}

export { FunctionRuntimeProcessor, RuntimeFunctionProcessorMethod };
