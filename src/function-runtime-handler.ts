import { Entrypoint } from "./interfaces";

const entrypoints: Entrypoint[] = [];

function Handler(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    if (typeof descriptor.value === "function") {
      const fn = descriptor.value as Entrypoint;
      entrypoints.push(fn);
    }
  };
}

function runEntrypoints(context: unknown): void {
  entrypoints.forEach((fn) => fn.apply(context, []));
}

export { Handler };
export { runEntrypoints };
