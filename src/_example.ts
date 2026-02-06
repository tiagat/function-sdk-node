
import { FunctionRuntime, Handler, Logger} from "./index";

class MyFunction extends FunctionRuntime {

  logger = new Logger();

  @Handler()
  main(): void {
    this.logger.info("Function Handler (main)");
  }

  @Handler()
  async mainAsync(): Promise<void> {
    this.logger.info("Function Handler (mainAsync)");
  }

}

new MyFunction();
