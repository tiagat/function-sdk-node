function Req(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    return null;
  };
}

function Res(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    return null;
  };
}

function Handler(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    if (typeof descriptor.value === "function") {
      const fn = descriptor.value as Entrypoint;
      entrypoints.push(fn);
    }
  };
}

export { Req, Res, Handler };
