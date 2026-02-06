import { Entrypoint, EntrypointFunction } from './function-entrypoint';

function Handler(): MethodDecorator {
  return (_target, propertyKey, descriptor) => {
    const fn = descriptor.value as EntrypointFunction;
    if (typeof descriptor.value === 'function') {
      const target = `${String(propertyKey)}`;
      const metadata = Entrypoint.metadata.get(target);
      metadata.fn = fn;
      Entrypoint.metadata.set(target, metadata);
    }
  };
}

function runEntrypoints(context: unknown): void {
  for (const metadata of Entrypoint.values()) {
    if (metadata.fn) {
      const argsMetadata = metadata.args.sort((a, b) => a.index - b.index);
      const args = Array(argsMetadata.length);

      for (const argMeta of argsMetadata) {
        args[argMeta.index] = 'DEMO'; // CHANGE THIS
      }

      metadata.fn.apply(context, args);
    }
  }
}

export { Handler };
export { runEntrypoints };
