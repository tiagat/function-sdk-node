import { Entrypoint, EntrypointFunction } from './entrypoints';
import { RuntimeFunctionProcessorMethod } from './function-runtime-processor';

function Handler(): MethodDecorator {
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

function decoratorRegistry(processorMethod: RuntimeFunctionProcessorMethod, methodParameter: unknown): ParameterDecorator {
  return (_target, propertyKey, parameterIndex) => {
    Entrypoint.register(`${String(propertyKey)}`, parameterIndex, processorMethod, methodParameter);
  };
}

function Req(): ParameterDecorator {
  return decoratorRegistry('getReq', undefined);
}

function Res(): ParameterDecorator {
  return decoratorRegistry('getRes', undefined);
}

function Call(): ParameterDecorator {
  return decoratorRegistry('getCall', undefined);
}

function Callback(): ParameterDecorator {
  return decoratorRegistry('getCallback', undefined);
}

export { Handler, Req, Req as Request, Res, Res as Response, Call, Callback };
