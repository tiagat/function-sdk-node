export type EntrypointFunction = (...args: unknown[]) => void;

interface EntrypointParameter {
  index: number;
  name: string;
  value: unknown;
}

interface EntrypointMetadata {
  fn: EntrypointFunction | undefined;
  args: EntrypointParameter[];
}

export class Entrypoint {
  private static entrypoints: Map<string, EntrypointMetadata> = new Map();

  static metadata = {
    get: (key: string): EntrypointMetadata => {
      const metadata = Entrypoint.entrypoints.get(key);
      if (!metadata) {
        Entrypoint.entrypoints.set(key, { fn: undefined, args: [] });
      }
      return Entrypoint.entrypoints.get(key)!;
    },

    set: (key: string, metadata: EntrypointMetadata): void => {
      Entrypoint.entrypoints.set(key, metadata);
    }
  };

  static register(target: string, index: number, name: string, value: unknown): void {
    const metadata = Entrypoint.metadata.get(target);
    metadata.args.push({ index, name, value });
    Entrypoint.metadata.set(target, metadata);
  }

  static entries(): IterableIterator<[string, EntrypointMetadata]> {
    return Entrypoint.entrypoints.entries();
  }

  static values(): IterableIterator<EntrypointMetadata> {
    return Entrypoint.entrypoints.values();
  }
}
