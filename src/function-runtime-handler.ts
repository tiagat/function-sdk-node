import { Entrypoint } from './entrypoints';

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

export { runEntrypoints };
