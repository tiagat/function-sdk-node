import { AsyncLocalStorage } from 'node:async_hooks';

import { RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';

export interface RuntimeContext {
  req: RunFunctionRequest;
  res: RunFunctionResponse;
}

const runtimeContextStorage = new AsyncLocalStorage<RuntimeContext>();

export function runWithRuntimeContext<T>(context: RuntimeContext, fn: () => T): T {
  return runtimeContextStorage.run(context, fn);
}

export function getRuntimeContext(): RuntimeContext {
  const context = runtimeContextStorage.getStore();
  if (!context) {
    throw new Error('Runtime context is not available. Use helper functions inside a handler.');
  }
  return context;
}
