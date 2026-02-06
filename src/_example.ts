
import {
  FunctionRuntime,
  Handler,
  Logger,
} from "./index";


const logger = new Logger();

class MyFunction extends FunctionRuntime {

  
  test(): void {
    logger.info("Test function");  
  }

  @Handler()
  main(): void {
    logger.info("Function Handler (main)");
    this.test();
  }

  @Handler()
  async mainAsync(): Promise<void> {
    logger.info("Function Handler (mainAsync)");
  }

}

new MyFunction();
