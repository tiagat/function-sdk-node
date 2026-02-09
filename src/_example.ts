import { Logger, FunctionRuntime } from './index';
import { Handler, Req, Res, Ctx, Env, Input, Composite } from './index';
import { Request, Response, Resource } from './index';

const logger = new Logger();

class MyFunction extends FunctionRuntime {
  @Handler()
  example1(@Req() req: Request, @Res() res: Response): void {
    logger.info({ req }, 'Received request');
    logger.info({ res }, 'Function Response');
  }

  @Handler()
  example2(@Ctx() ctx: Record<string, unknown>): void {
    logger.info({ ctx }, 'Function Context');
  }

  @Handler()
  example3(@Env() env: Record<string, unknown>): void {
    logger.info({ env }, 'Environment Config');
  }

  @Handler()
  example4(@Input() input?: Record<string, unknown>): void {
    logger.info({ input }, 'Function Input');
  }

  @Handler()
  example5(@Composite() composite?: Resource): void {
    logger.info({ composite }, 'Observed Composite Resource');
  }
}

new MyFunction();
