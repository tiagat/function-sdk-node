
import { FunctionRuntime, Handler, Logger } from "./index";

class MyFunction extends FunctionRuntime {

  logger = new Logger();
  
  test() {
    console.log(this.logger);
  }

  @Handler()
  main(): void {
    // this.logger.info("Function Handler (main)");
    this.test();
  }

  @Handler()
  async mainAsync(): Promise<void> {
    // this.logger.info("Function Handler (mainAsync)");
  }

}

new MyFunction();
