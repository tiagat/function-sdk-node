import { FunctionRuntime, Handler, Logger, Environment, Context } from './index';

class MyFunction extends FunctionRuntime {
  logger = new Logger();

  @Handler()
  getEnvironment(@Environment() env: Record<string, unknown>): void {
    this.logger.info({ env }, 'Environment Config');
  }

  @Handler()
  getContext(@Context() ctx: Record<string, unknown>): void {
    this.logger.info({ ctx }, 'Function Context');
  }
}

new MyFunction();
