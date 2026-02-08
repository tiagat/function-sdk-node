import { Entrypoint, EntrypointFunction } from './entrypoints';
import { RuntimeFunctionProcessorMethod } from './function-runtime-processor';

const decoratorRegistry = (processorMethod: RuntimeFunctionProcessorMethod, methodParameter: unknown): ParameterDecorator => {
  return (_target, propertyKey, parameterIndex) => {
    Entrypoint.register(`${String(propertyKey)}`, parameterIndex, processorMethod, methodParameter);
  };
};

export function Handler(): MethodDecorator {
  return (_target, propertyKey, descriptor) => {
    const fn = descriptor.value as EntrypointFunction;
    if (typeof descriptor.value === 'function') {
      const target = `${String(propertyKey)}`;
      const metadata = Entrypoint.metadata.get(target);
      metadata.fn = fn;
      Entrypoint.metadata.set(target, metadata);
    }
  };
}

export function Req(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getReq';
  return decoratorRegistry(method, undefined);
}

export function Res(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getRes';
  return decoratorRegistry(method, undefined);
}
