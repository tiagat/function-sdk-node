
import { FunctionRuntime, Handler, Logger, Req, Res } from "./index";

class MyFunction extends FunctionRuntime {

  logger = new Logger();
  
  @Handler()
  main(): void {
    this.logger.info("Function Handler (main)");
  }

  @Handler()
  async mainAsync(@Req() req: unknown, @Res() res: unknown): Promise<void> {
    this.logger.info({ req, res }, 'Request and Response');
    this.logger.info("Function Handler (mainAsync)");
  }

}

new MyFunction();
