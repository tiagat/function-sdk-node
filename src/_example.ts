import { Logger, FunctionRuntime, Composed } from './index';
import { Handler, Req, Res, Ctx, Env, Input, Composite, Required } from './index';
import { Request, Response, Resource, ResourceSelector } from './index';
import { requiredResource, composedResource } from './index';

class MyFunction extends FunctionRuntime {
  logger = new Logger();

  @Handler()
  example1(@Req() req: Request, @Res() res: Response): void {
    this.logger.info({ req }, 'Received request');
    this.logger.info({ res }, 'Function Response');
  }

  @Handler()
  example2(@Ctx() ctx: Record<string, unknown>): void {
    this.logger.info({ ctx }, 'Function Context');
  }

  @Handler()
  example3(@Env() env: Record<string, unknown>): void {
    this.logger.info({ env }, 'Environment Config');
  }

  @Handler()
  example4(@Input() input?: Record<string, unknown>): void {
    this.logger.info({ input }, 'Function Input');
  }

  @Handler()
  example5(@Composite() composite?: Resource): void {
    this.logger.info({ composite }, 'Observed Composite Resource');
  }

  @Handler()
  example6(@Composed('bucket-primary') composed?: Resource): void {
    if (!composed) return;
    this.logger.info({ composed }, 'Observed Composed Resource');
  }

  @Handler()
  example7(@Required('app-config-static') required?: Resource[]): void {
    if (!required || required.length === 0) return;
    const resource = required[0];
    this.logger.info({ resource }, 'Required Resource (loaded by composition configuration)');
  }

  @Handler({
    required: [
      {
        requirementName: 'app-config-dynamic-1',
        apiVersion: 'v1',
        kind: 'ConfigMap',
        namespace: 'default',
        matchName: 'app-config-dynamic'
      }
    ]
  })
  example8(@Required('app-config-dynamic-1') required?: Resource[]): void {
    if (!required || required.length === 0) return;
    const resource = required[0];
    this.logger.info({ resource }, 'Required Resource (loaded by handler configuration)');
  }

  @Handler()
  example9(): void {
    const selector: ResourceSelector = {
      requirementName: 'app-config-dynamic-2',
      apiVersion: 'v1',
      kind: 'ConfigMap',
      namespace: 'default',
      matchName: 'app-config-dynamic'
    };

    const required = requiredResource(selector);
    if (!required || required.length === 0) {
      return;
    }

    const resource = required[0];
    this.logger.info({ resource }, 'Required Resource (loaded by helper function)');
  }

  @Handler()
  example10(): void {
    const bucket = composedResource('bucket-secondary');
    bucket.resource = {
      apiVersion: 's3.aws.m.upbound.io/v1beta1',
      kind: 'Bucket',
      annotations: {
        'crossplane.io/external-name:': 'bucket-secondary.tiagat.dev'
      },
      spec: {
        forProvider: {
          region: 'eu-west-1'
        }
      }
    };
    this.logger.info({ bucket: bucket.toObject() }, 'Desired State');
  }
}

new MyFunction();
