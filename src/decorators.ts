import { Entrypoint, EntrypointFunction } from './entrypoints';
import { RuntimeFunctionProcessorMethod } from './function-runtime-processor';
import { ResourceSelector } from './interfaces';
import { FunctionRequirements } from './function-requirements';

const decoratorRegistry = (processorMethod: RuntimeFunctionProcessorMethod, methodParameter: unknown): ParameterDecorator => {
  return (_target, propertyKey, parameterIndex) => {
    Entrypoint.register(`${String(propertyKey)}`, parameterIndex, processorMethod, methodParameter);
  };
};

const isAsync = (fn: EntrypointFunction): boolean => {
  return fn.constructor && fn.constructor.name === 'AsyncFunction';
};

export interface HandlerOptions {
  required?: ResourceSelector[];
}

export function Handler(options?: HandlerOptions): MethodDecorator {
  if (options?.required) {
    options.required.forEach((selector) => FunctionRequirements.registerSelector(selector));
  }
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

export function Input(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getInput';
  return decoratorRegistry(method, undefined);
}

export function Composite(): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getComposite';
  return decoratorRegistry(method, undefined);
}

export function Required(name: string): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getRequired';
  return decoratorRegistry(method, name);
}

export function Observed(name: string): ParameterDecorator {
  const method: RuntimeFunctionProcessorMethod = 'getObserved';
  return decoratorRegistry(method, name);
}
