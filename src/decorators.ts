import { setEntrypoint } from './function-runtime-handler';

const DECORATOR_REQ_KEY = 'req';
const DECORATOR_RES_KEY = 'res';

function Req(): ParameterDecorator {
  return (_target, propertyKey, parameterIndex) => {
    setEntrypoint(`${String(propertyKey)}`, parameterIndex, DECORATOR_REQ_KEY, undefined);
  };
}

function Res(): ParameterDecorator {
  return (_target, propertyKey, parameterIndex) => {
    setEntrypoint(`${String(propertyKey)}`, parameterIndex, DECORATOR_RES_KEY, undefined);
  };
}

export { Req, Req as Request, Res, Res as Response };
