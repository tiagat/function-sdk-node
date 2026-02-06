import { FunctionRuntimeServer } from "./function-runtime-server";

export class FunctionRuntime {
  private readonly server: FunctionRuntimeServer;

  constructor() {
    this.server = new FunctionRuntimeServer(this);
    this.server.start();
  }
}
