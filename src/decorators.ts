function Req(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    return;
  };
}

function Res(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    return;
  };
}

export { Req, Req as Request, Res, Res as Response };
