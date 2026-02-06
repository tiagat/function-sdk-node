import { FunctionRuntime } from "./function-runtime"
import { Handler } from "./function-runtime-handler";

import logger from "./logger";

class MyFunction extends FunctionRuntime {

  @Handler()
  main(): void {
    logger.info("Function Handler (main)");
  }
}

new MyFunction();
