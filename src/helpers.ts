import { Resource, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';
import { ResourceSelector } from './interfaces';
import { FunctionRequirements } from './function-requirements';
import { ComposedResource } from './composed-resource';

export function requiredResource(req: RunFunctionRequest, res: RunFunctionResponse, selector: ResourceSelector): Resource[] | undefined {
  FunctionRequirements.registerSelector(selector);
  FunctionRequirements.updateRequirements(res);
  return req.requiredResources[selector.requirementName]?.items;
}

export function composedResource(
  req: RunFunctionRequest,
  res: RunFunctionResponse,
  compositionName: string,
  resource?: { [key: string]: unknown }
): ComposedResource {
  const desiredResource = new ComposedResource(req, res, compositionName);
  if (resource) {
    desiredResource.resource = { ...resource };
  }
  return desiredResource;
}
