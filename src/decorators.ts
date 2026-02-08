import { Entrypoint, EntrypointFunction } from './entrypoints';

const alias = {
  Req: 'Req',
  Res: 'Res',
  Call: 'Call',
  Callback: 'Callback'
};

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

function decoratorRegistry(decoratorName: string, decoratorParameter: any): ParameterDecorator {
  return (_target, propertyKey, parameterIndex) => {
    Entrypoint.register(`${String(propertyKey)}`, parameterIndex, decoratorName, decoratorParameter);
  };
}

function Req(): ParameterDecorator {
  return decoratorRegistry(alias.Req, undefined);
}

function Res(): ParameterDecorator {
  return decoratorRegistry(alias.Res, undefined);
}

function Call(): ParameterDecorator {
  return decoratorRegistry(alias.Call, undefined);
}

function Callback(): ParameterDecorator {
  return decoratorRegistry(alias.Callback, undefined);
}

export { alias, Handler, Req, Req as Request, Res, Res as Response, Call, Callback };
