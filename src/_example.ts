import { FunctionRuntime, Handler, Logger, Req, Res, RunFunctionRequest, RunFunctionResponse, Resource, Ready } from './index';

class MyFunction extends FunctionRuntime {
  logger = new Logger();

  @Handler()
  main(@Res() res: RunFunctionResponse): void {
    const bucket: Resource = {
      resource: {
        apiVersion: 's3.aws.m.upbound.io/v1beta1',
        kind: 'Bucket'
      },
      connectionDetails: {},
      ready: Ready.READY_TRUE
    };

    if (res.desired?.resources) {
      res.desired.resources['bucker'] = bucket;
    } else {
      res.desired = { resources: { bucker: bucket } };
    }
  }

  @Handler()
  async mainAsync(@Req() req: RunFunctionRequest, @Res() res: RunFunctionResponse): Promise<void> {
    this.logger.info({ req, res }, 'Function Handler (mainAsync)');
  }
}

new MyFunction();
