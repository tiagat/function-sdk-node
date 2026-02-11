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

!!! TBD !!!
```

## Edit the template to add the function’s logic

