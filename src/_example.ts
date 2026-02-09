import { Logger, FunctionRuntime } from './index';
import { Handler, Req, Res, Ctx, Env, Input, Composite, Required } from './index';
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

  @Handler()
  example6(@Required('app-config-static') required?: Resource[]): void {
    if (!required || required.length === 0) return;
    const resource = required[0];
    logger.info({ resource }, 'Required Resource (loaded by composition configuration)');
  }

  @Handler({
    required: [
      {
        requirementName: 'app-config-dynamic',
        apiVersion: 'v1',
        kind: 'ConfigMap',
        namespace: 'default',
        matchName: 'app-config-dynamic'
      }
    ]
  })
  example7(@Required('app-config-dynamic') required?: Resource[]): void {
    if (!required || required.length === 0) return;
    const resource = required[0];
    logger.info({ resource }, 'Required Resource (loaded by @Handler)');
  }
}

new MyFunction();
