# function-sdk-node

![Status](https://img.shields.io/badge/Status-WIP-orange)

> [!WARNING]
> 🚧 This SDK is under active development and is not yet stable.


The [Node.js](https://nodejs.org/) SDK for writing [composition functions](https://docs.crossplane.io/v2.1/packages/functions/)


This SDK is currently a beta. We try to avoid breaking changes, but it will not have a stable API until it reaches v1.0.0. It follows the same [contributing guidelines](https://github.com/crossplane/crossplane/tree/master/contributing) as Crossplane.


If you just want to jump in and get started, consider using the [function-template-node](https://github.com/tiagat/function-template-node) template repository.


## Overview

Composition functions (or just functions, for short) are custom programs that template Crossplane resources. Crossplane calls composition functions to determine what resources it should create when you create a composite resource (XR). Read the [concepts](https://docs.crossplane.io/latest/composition/compositions/) page to learn more about composition functions.

You can write a function to template resources using a general purpose programming language. Using a general purpose programming language allows a function to use advanced logic to template resources, like loops and conditionals. This guide explains how to write a composition function in [Node.js](https://nodejs.org/).

> [!IMPORTANT]
> It helps to be familiar with [how composition functions](https://docs.crossplane.io/latest/composition/compositions/#how-composition-functions-work) work before following this guide.


## Prerequisites

- [Node.js]() v24.13.0 (LTS) or newer
- [Docker Engine](https://docs.docker.com/engine/) This guide uses OrbStack version 2.0.5
- The [Crossplane CLI](https://docs.crossplane.io/latest/cli/) v2.1 or newer.


## Initialize the function from a template


Use the `crossplane xpkg init` command to initialize a new function. When you run this command it initializes your function using a [GitHub repository](https://github.com/tiagat/function-template-node) as a template.

```bash
crossplane xpkg init function-example https://github.com/tiagat/function-template-node
```

The `crossplane xpkg init` command creates a directory named function-xbuckets. When you run the command the new directory should look like this:

```bash
ls function-example

!!! 🚧 TBD !!!
```

## FunctionRuntime
FunctionRuntime is the base class that must be extended to implement a Crossplane Function in Node.js.

Under the hood, it starts a gRPC server that communicates with Crossplane and the Crossplane CLI. The SDK abstracts away all low-level gRPC details, allowing you to focus entirely on business logic.


**What It Does**

When your class extends FunctionRuntime, the SDK:

-	Starts a gRPC server implementing the Crossplane FunctionRunnerService
- Listens for RunFunction requests from Crossplane (in-cluster) or Crossplane CLI
- Parses and maps the incoming request into typed runtime objects
- Executes all registered @Handler() methods
- Collects and returns the resulting RunFunctionResponse


**Basic Usage**

```typescript
import { 
  Logger, FunctionRuntime,
  Handler, Req, Res, Composite,
  Request, Response, Resource
} from '@tiagat/function-sdk-node';


class MyFunction extends FunctionRuntime {
  logger = new Logger();

  @Handler()
  example1(@Req() req: Request, @Res() res: Response): void {
    this.logger.info({ res }, 'Function Request/Response');
  }

  @Handler()
  example2(@Composite() composite?: Resource): void {
    this.logger.info({ composite }, 'Observed Composite Resource');
  }
}

new MyFunction();

```

## Method Decorator

### @Handler()

The `@Handler()` decorator marks a method as a  entry point that will be executed when Crossplane invokes your function.

Behavior
-	There is no limit to the number of methods that can be decorated with `@Handler()`.
-	All decorated methods will be executed when Crossplane calls the function one by one.
-	Adding `@Handler()` to an async method works exactly the same way as with regular function

**Example**

```typescript
class MyFunction extends FunctionRuntime {

  @Handler()
  handleSync() {
    console.log("Fist handler executed");
  }

  @Handler()
  async handleAsync(): Promise<void> {
    await someAsyncOperation();
    console.log("Second handler executed");
  }
}
```

## Parameter Decorators

### @Req() and @Res()

The `@Req()` and `@Res()` parameter decorators provide direct access to the underlying FunctionRequest and FunctionResponse objects.

These decorators are intended for advanced use cases where the higher-level SDK helpers are not sufficient and you need full control over the request/response lifecycle.

In most cases, you should rely on the built-in decorators and helper methods such as:
	•	@Composite()
	•	@Composed()
	•	@Ctx()
	•	etc.

However, if you:
	•	Need to access raw observed or desired state
	•	Want to manipulate the response at a low level
	•	Need full control over metadata, TTL, conditions, or results
	•	Know exactly what you are doing and require complete flexibility

You can inject the raw objects using `@Req()` and `@Res()`.

```typescript
@Handler()
example(@Req() req: Request, @Res() res: Response): void {
  logger.info({ req }, 'Received request');
  logger.info({ res }, 'Function Response');
}
```

**Important**

Using `@Req()` and `@Res()` bypasses some of the higher-level abstractions provided by the SDK.

This means:
	•	You are responsible for maintaining response integrity
	•	You must ensure desired state are valid
	•	Improper mutations may lead to unexpected Crossplane behavior


### @Ctx() and @Env()

The `@Ctx()` parameter decorator provides access to the current Crossplane Function Context.
It allows you to read and modify contextual data that flows between functions in a Composition pipeline.

**What is Context in Crossplane Composition?**

In a Crossplane Composition pipeline, multiple functions may be executed sequentially.

Each function receives:
	•	The **observed state**
	•	The **desired state**
	•	An optional **context** object

The context is:
	•	A JSON-like structured object
	•	Passed from one function to the next
	•	Mutable during pipeline execution
	•	Discarded after the final function completes

This enables lightweight communication between functions within the same pipeline run.

The `@Env()` parameter decorator provides access to the pipeline environment configuration.

It is conceptually similar to `@Ctx()`, but specifically designed for working with environment-level configuration data inside a Crossplane Composition pipeline.

Internally, environment data is stored within the pipeline context, but `@Env()` provides a clean, purpose-specific abstraction for accessing it.

In Crossplane Composition pipelines, the environment typically represents shared configuration values that apply across multiple functions.

Environment data is most commonly populated by the official: [function-environment-configs](https://github.com/crossplane-contrib/function-environment-configs) This function reads EnvironmentConfig resources and injects their values into the pipeline context so that subsequent functions can consume them.


**Example**

```
  @Handler()
  example2(@Ctx() ctx: Record<string, unknown>): void {
    logger.info({ ctx }, 'Function Context');
    ctx['myValue'] = 'example';
  }

  @Handler()
  example3(@Env() env: Record<string, unknown>): void {
    logger.info({ env }, 'Environment Config');
    env['myValue'] = 'example';
  }
```

### @Input()

### @Composite()

### Composed()

### @Required()
