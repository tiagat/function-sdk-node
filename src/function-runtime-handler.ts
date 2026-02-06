import { get } from 'http';
import { Entrypoint } from './interfaces';

interface EntrypointParameter {
  index: number;
  name: string;
  value: unknown;
}

interface EntrypointMetadata {
  fn: Entrypoint | undefined;
  args: EntrypointParameter[];
}

const entrypoints: Map<string, EntrypointMetadata> = new Map();

function getEntrypointMetadata(key: string): EntrypointMetadata {
  const metadata = entrypoints.get(key);
  if (!metadata) {
    entrypoints.set(key, { fn: undefined, args: [] });
  }
  return entrypoints.get(key)!;
}

function setEntrypointMetadata(key: string, metadata: EntrypointMetadata): void {
  entrypoints.set(key, metadata);
}

function Handler(): MethodDecorator {
  return (_target, propertyKey, descriptor) => {
    const fn = descriptor.value as Entrypoint;
    if (typeof descriptor.value === 'function') {
      const target = `${String(propertyKey)}`;
      const metadata = getEntrypointMetadata(target);
      metadata.fn = fn;
      setEntrypointMetadata(target, metadata);
    }
  };
}

function runEntrypoints(context: unknown): void {
  for (const [_entrypoint, metadata] of entrypoints.entries()) {
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

function registerEntrypoint(target: string, index: number, name: string, value: unknown): void {
  const metadata = getEntrypointMetadata(target);
  metadata.args.push({ index, name, value });
  setEntrypointMetadata(target, metadata);
}

export { Handler };
export { runEntrypoints, registerEntrypoint };
