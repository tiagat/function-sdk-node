import { Ready, Resource, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';

export class ComposedResource implements Resource {
  #name: string;
  #res: RunFunctionResponse;

  #resource?: Record<string, unknown>;
  #connectionDetails: Record<string, Buffer<ArrayBufferLike>> = {};
  #ready: Ready = Ready.READY_TRUE;

  public get resource(): Record<string, unknown> | undefined {
    return this.#resource;
  }

  public set resource(value: Record<string, unknown>) {
    this.#resource = Object.assign({}, this.#resource, value);
    this.update();
  }

  public get connectionDetails(): Record<string, Buffer<ArrayBufferLike>> {
    return this.#connectionDetails;
  }

  public get ready(): Ready {
    return this.#ready;
  }

  public set ready(value: Ready) {
    this.#ready = value;
    this.update();
  }

  constructor(req: RunFunctionRequest, res: RunFunctionResponse, name: string) {
    this.#res = res;
    this.#name = name;

    if (!this.#res.desired) {
      this.#res.desired = { resources: {} };
    }

    const existing = req.observed?.resources[name];
    if (existing) {
      this.#resource = existing.resource;
      this.#connectionDetails = existing.connectionDetails;
      this.#ready = existing.ready;
    }
  }

  update(): void {
    if (this.#resource) {
      this.#res.desired!.resources[this.#name] = this.toObject();
    }
  }

  toObject(): Resource {
    return {
      resource: this.#resource,
      connectionDetails: this.#connectionDetails,
      ready: this.#ready
    };
  }
}
