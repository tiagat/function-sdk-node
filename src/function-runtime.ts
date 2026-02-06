// import { setHandlerInstance } from "./function-runtime-handler";
import { FunctionRuntimeServer } from "./function-runtime-server";

export class FunctionRuntime {
  private readonly server: FunctionRuntimeServer;

  constructor() {
    // setHandlerInstance(this);
    this.server = new FunctionRuntimeServer();
    this.server.start();
  }
}
