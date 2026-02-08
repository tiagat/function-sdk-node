import { Logger, FunctionRuntime } from './index';
import { Handler, Req, Res, Ctx, Env, Composite } from './index';
import { Request, Response, Environment, Context, Resource } from './index';

const logger = new Logger();

class MyFunction extends FunctionRuntime {
  @Handler()
  example1(@Req() req: Request, @Res() res: Response): void {
    logger.info({ req }, 'Received request');
    logger.info({ res }, 'Function Response');
  }

  @Handler()
  example2(@Ctx() ctx: Context): void {
    logger.info({ ctx }, 'Function Context');
  }

  @Handler()
  example3(@Env() env: Environment): void {
    logger.info({ env }, 'Environment Config');
  }

  @Handler()
  example4(@Composite() composite?: Resource): void {
    logger.info({ composite }, 'Observed Composite Resource');
  }
}

new MyFunction();
