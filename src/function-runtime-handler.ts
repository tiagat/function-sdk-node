import * as grpc from '@grpc/grpc-js';

import { RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';
import { Entrypoint, EntrypointFunction } from './entrypoints';

import { FunctionRuntimeProcessor, RuntimeFunctionProcessorMethod } from './function-runtime-processor';

interface RuntimeFunctionHandlerContext {
  call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>;
  callback: grpc.sendUnaryData<RunFunctionResponse>;
  functionContext: unknown;
}

class RuntimeFunctionHandler {
  private readonly functionContext: unknown;
  private readonly processor: FunctionRuntimeProcessor;

  constructor(context: RuntimeFunctionHandlerContext) {
    this.processor = new FunctionRuntimeProcessor(context);
    this.functionContext = context.functionContext;
  }

  runEntrypoints(): RunFunctionResponse {
    for (const handler of Entrypoint.values()) {
      if (handler.fn) {
        const handlerArgsMeta = handler.args.sort((a, b) => a.index - b.index);
        const argsCount = handlerArgsMeta.length ? Math.max(...handlerArgsMeta.map((arg) => arg.index)) + 1 : 0;
        const args = Array(argsCount);

        for (const arg of handlerArgsMeta) {
          const methodName = arg.name as RuntimeFunctionProcessorMethod;
          const callback = this.processor[methodName] as EntrypointFunction;
          const result = callback.apply(this.processor, [arg.value]);
          args[arg.index] = result;
        }

        handler.fn.apply(this.functionContext, args);
      }
    }

    return this.processor.getRes();
  }
}

export { RuntimeFunctionHandler, RuntimeFunctionHandlerContext };
