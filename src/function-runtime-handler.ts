import * as grpc from '@grpc/grpc-js';

import { RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';
import { Entrypoint, EntrypointFunction } from './entrypoints';

interface RuntimeFunctionHandlerContext {
  call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>;
  callback: grpc.sendUnaryData<RunFunctionResponse>;
  functionContext: unknown;
}

type PublicMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type RuntimeFunctionProcessorMethod = PublicMethodNames<RuntimeFunctionProcessor>;

class RuntimeFunctionProcessor {
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

class RuntimeFunctionHandler {
  private readonly functionContext: unknown;
  private readonly processor: RuntimeFunctionProcessor;

  constructor(context: RuntimeFunctionHandlerContext) {
    this.processor = new RuntimeFunctionProcessor(context);
    this.functionContext = context.functionContext;
  }

  runEntrypoints(): RunFunctionResponse {
    for (const metadata of Entrypoint.values()) {
      if (metadata.fn) {
        const argsMetadata = metadata.args.sort((a, b) => a.index - b.index);

        const argsCount = argsMetadata.length ? Math.max(...argsMetadata.map((arg) => arg.index)) + 1 : 0;
        const args = Array(argsCount);

        for (const argMeta of argsMetadata) {
          const methodName = argMeta.name as RuntimeFunctionProcessorMethod;
          const callback = this.processor[methodName] as EntrypointFunction;
          const result = callback.apply(this.processor, [argMeta.value]);
          args[argMeta.index] = result;
        }

        metadata.fn.apply(this.functionContext, args);
      }
    }

    return this.processor.getRes();
  }
}

export { RuntimeFunctionHandler, RuntimeFunctionHandlerContext, RuntimeFunctionProcessorMethod };
