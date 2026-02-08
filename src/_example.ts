import { Logger, FunctionRuntime } from './index';
import { Handler, Req, Res, Ctx, Env, Composite } from './index';
import { Request, Response, Environment, Context, Resource } from './index';

const logger = new Logger();

class MyFunction extends FunctionRuntime {
  @Handler()
  getRequest(@Req() req: Request): void {
    logger.info({ req }, 'Received request');
  }

  @Handler()
  getResponse(@Res() res: Response): void {
    logger.info({ res }, 'Function Response');
  }

  @Handler()
  getEnvironment(@Env() env: Environment): void {
    logger.info({ env }, 'Environment Config');
  }

  @Handler()
  getContext(@Ctx() ctx: Context): void {
    logger.info({ ctx }, 'Function Context');
  }

  @Handler()
  getComposite(@Composite() composite?: Resource): void {
    logger.info({ composite }, 'Observed Composite Resource');
  }
}

new MyFunction();
