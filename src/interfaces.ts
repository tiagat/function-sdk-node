export interface Environment {
  [key: string]: unknown;
}

export interface Context {
  [key: string]: unknown;
}

export { RunFunctionResponse as Response, RunFunctionRequest as Request, Resource, Ready } from './gen/proto/run_function';
