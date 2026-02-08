import { FunctionRuntime, Handler, Logger, Req, Res, RunFunctionRequest, RunFunctionResponse, Resource, Ready } from './index';

class MyFunction extends FunctionRuntime {
  logger = new Logger();

  @Handler()
  main(@Req() req: RunFunctionRequest, @Res() res: RunFunctionResponse): void {
    this.logger.info({ req, res }, 'Function Handler (main)');
  }

}

new MyFunction();
