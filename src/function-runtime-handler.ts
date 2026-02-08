import * as grpc from '@grpc/grpc-js';

import { RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';
import { Entrypoint } from './entrypoints';

import * as decorator from './decorators';

interface RuntimeFunctionHandlerContext {
  call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>;
  callback: grpc.sendUnaryData<RunFunctionResponse>;
  functionContext: unknown;
}

class RuntimeFunctionProcessor {
  private readonly _call: grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse>;
  private readonly _callback: grpc.sendUnaryData<RunFunctionResponse>;
  private readonly _response: RunFunctionResponse;

  constructor(context: RuntimeFunctionHandlerContext) {
    this._call = context.call;
    this._callback = context.callback;
    this._response = {
      context: this._call.request.context,
      desired: this._call.request.desired,
      results: [],
      conditions: []
    };
  }

  [decorator.alias.Call](): grpc.ServerUnaryCall<RunFunctionRequest, RunFunctionResponse> {
    return this._call;
  }

  [decorator.alias.Callback](): grpc.sendUnaryData<RunFunctionResponse> {
    return this._callback;
  }

  [decorator.alias.Req](): RunFunctionRequest {
    return this._call.request;
  }

  [decorator.alias.Res](): RunFunctionResponse {
    return this._response;
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

        const argsCount = argsMetadata.length ? Math.max(...argsMetadata.map(arg => arg.index)) + 1 : 0;
        const args = Array(argsCount);

        for (const argMeta of argsMetadata) {
          args[argMeta.index] = this.processor[argMeta.name]();
        }
        metadata.fn.apply(this.functionContext, args);
      }
    }

    return this.processor[decorator.alias.Res]();
  }
}

export { RuntimeFunctionHandler, RuntimeFunctionHandlerContext };
