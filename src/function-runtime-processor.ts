import * as grpc from '@grpc/grpc-js';
import { Resource, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';

import { RuntimeFunctionHandlerContext } from './function-runtime-handler';

import { ENVIRONMENT_CONFIG_KEY } from './constants';

type PublicMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type RuntimeFunctionProcessorMethod = PublicMethodNames<FunctionRuntimeProcessor>;

class FunctionRuntimeProcessor {
  private readonly call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>;
  private readonly response: RunFunctionResponse;

  constructor(context: RuntimeFunctionHandlerContext) {
    this.call = context.call;
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

  getContext(): Record<string, unknown> {
    if (!this.call.request.context) {
      this.call.request.context = {
        [ENVIRONMENT_CONFIG_KEY]: {}
      };
    }
    return this.call.request.context;
  }

  getEnvironment(): Record<string, unknown> {
    if (!this.call.request.context) {
      this.call.request.context = {
        [ENVIRONMENT_CONFIG_KEY]: {}
      };
    }
    return this.call.request.context[ENVIRONMENT_CONFIG_KEY];
  }

  getInput(): Record<string, unknown> | undefined {
    return this.call.request.input;
  }

  getComposite(): Resource | undefined {
    return this.call.request.observed?.composite;
  }

  getRequired(name: string): Resource[] | undefined {
    const resources = this.call.request.requiredResources[name];
    return resources ? resources.items : undefined;
  }

  // getObserved(name: string): Resource[] | undefined {
  //   return undefined;
  // }
}

export { FunctionRuntimeProcessor, RuntimeFunctionProcessorMethod };
