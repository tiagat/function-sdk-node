
import { FunctionRuntime, Handler, Logger, Req, Res } from "./index";

class MyFunction extends FunctionRuntime {

  logger = new Logger();
  
  test() {
    console.log(this.logger);
  }

  @Handler()
  main(): void {
    this.logger.info("Function Handler (main)");
    this.test();
  }

  @Handler()
  async mainAsync(@Req() req: unknown, @Res() res: unknown): Promise<void> {
    this.logger.info({ req, res }, 'Request and Response');
    this.logger.info("Function Handler (mainAsync)");
  }

}

new MyFunction();
