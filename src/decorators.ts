import { Entrypoint, EntrypointFunction } from './function-entrypoint';

const DECORATOR_REQ_KEY = 'req';
const DECORATOR_RES_KEY = 'res';

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

function Req(): ParameterDecorator {
  return (_target, propertyKey, parameterIndex) => {
    Entrypoint.register(`${String(propertyKey)}`, parameterIndex, DECORATOR_REQ_KEY, undefined);
  };
}

function Res(): ParameterDecorator {
  return (_target, propertyKey, parameterIndex) => {
    Entrypoint.register(`${String(propertyKey)}`, parameterIndex, DECORATOR_RES_KEY, undefined);
  };
}

export { Handler, Req, Req as Request, Res, Res as Response };
