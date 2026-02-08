import { Logger, FunctionRuntime } from './index';
import { Composite, Context, Environment, Handler, Request, Resource, Response, RunFunctionRequest, RunFunctionResponse } from './index';

class MyFunction extends FunctionRuntime {
  logger = new Logger();

  @Handler()
  getRequest(@Request() req: RunFunctionRequest): void {
    this.logger.info({ req }, 'Received request');
  }

  @Handler()
  getResponse(@Response() res: RunFunctionResponse): void {
    this.logger.info({ res }, 'Function Response');
  }

  @Handler()
  getEnvironment(@Environment() env: Record<string, unknown>): void {
    this.logger.info({ env }, 'Environment Config');
  }

  @Handler()
  getContext(@Context() ctx: Record<string, unknown>): void {
    this.logger.info({ ctx }, 'Function Context');
  }

  @Handler()
  getComposite(@Composite() composite?: Resource): void {
    this.logger.info({ composite }, 'Composite Resource');
  }
}

new MyFunction();
