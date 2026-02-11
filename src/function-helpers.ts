import { Resource } from './gen/proto/run_function';
import { ResourceSelector } from './interfaces';
import { FunctionRequirements } from './function-requirements';
import { ComposedResource } from './composed-resource';

import { getRuntimeContext } from './function-runtime-context';

export function requiredResource(selector: ResourceSelector): Resource[] | undefined {
  const context = getRuntimeContext();
  const { req, res } = context;
  FunctionRequirements.registerSelector(selector);
  FunctionRequirements.updateRequirements(res);
  return req.requiredResources[selector.requirementName]?.items;
}

export function composedResource(compositionName: string, resource?: { [key: string]: unknown }): ComposedResource {
  const context = getRuntimeContext();
  const { req, res } = context;
  const desiredResource = new ComposedResource(req, res, compositionName);
  if (resource) {
    desiredResource.resource = { ...resource };
  }
  return desiredResource;
}
