import { FunctionRuntime, Handler, Logger, Environment } from './index';

class MyFunction extends FunctionRuntime {
  logger = new Logger();

  @Handler()
  main(@Environment() env: Record<string, string>): void {
    this.logger.info({ env }, 'Environment Config');
    env['test'] = 'Hello, World!';
  }
}

new MyFunction();
