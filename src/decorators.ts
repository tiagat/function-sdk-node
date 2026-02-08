import { Entrypoint, EntrypointFunction } from './entrypoints';
import { RuntimeFunctionProcessorMethod } from './function-runtime-processor';

const decoratorRegistry = (processorMethod: RuntimeFunctionProcessorMethod, methodParameter: unknown): ParameterDecorator => {
  return (_target, propertyKey, parameterIndex) => {
    Entrypoint.register(`${String(propertyKey)}`, parameterIndex, processorMethod, methodParameter);
  };
};

const isAsync = (fn: EntrypointFunction): boolean => {
  return fn.constructor && fn.constructor.name === 'AsyncFunction';
};

export function Handler(): MethodDecorator {
  return (_target, propertyKey, descriptor) => {
    const fn = descriptor.value as EntrypointFunction;
    if (typeof descriptor.value === 'function') {
      const target = `${String(propertyKey)}`;
      const metadata = Entrypoint.metadata.get(target);
      metadata.fn = fn;
      metadata.async = isAsync(fn);
      Entrypoint.metadata.set(target, metadata);
    }
  };
}

export function Req(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getRequest';
  return decoratorRegistry(method, undefined);
}

export function Res(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getResponse';
  return decoratorRegistry(method, undefined);
}

export function Ctx(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getContext';
  return decoratorRegistry(method, undefined);
}

export function Env(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getEnvironment';
  return decoratorRegistry(method, undefined);
}

export function Composite(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getComposite';
  return decoratorRegistry(method, undefined);
}
