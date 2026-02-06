import { Entrypoint } from './interfaces';

const entrypoints: Entrypoint[] = [];

function Handler(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    const fn = descriptor.value as Entrypoint;
    if (typeof descriptor.value === 'function') {
      entrypoints.push(fn);
    }
  };
}

function runEntrypoints(context: unknown): void {
  entrypoints.forEach((fn) => fn.apply(context, ['DEMO', 'EXAMPLE']));
}

export { Handler };
export { runEntrypoints };

// const paramIndexByName = new Map<string, number>();

// function FromContext(name: string): ParameterDecorator {
//   return (target, propertyKey, parameterIndex) => {
//     const key = `${String(propertyKey)}:${name}`;
//     paramIndexByName.set(key, parameterIndex);
//   };
// }

// function Handler(): MethodDecorator {
//   return (_target, propertyKey, descriptor) => {
//     const original = descriptor.value as (...args: any[]) => any;
//     descriptor.value = function (...args: any[]) {
//       const key = `${String(propertyKey)}:userId`;
//       const index = paramIndexByName.get(key);
//       if (index !== undefined) {
//         args[index] = "injected-user-id";
//       }
//       return original.apply(this, args);
//     };
//   };
// }

// class Example {
//   @Handler()
//   run(@FromContext("userId") userId: string) {
//     console.log(userId);
//   }
// }
