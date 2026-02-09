import { Resource, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';
import { ResourceSelector } from './interfaces';
import { FunctionRequirements } from './function-requirements';

export function requiredResource(selector: ResourceSelector, req: RunFunctionRequest, res: RunFunctionResponse): Resource[] | undefined {
  FunctionRequirements.registerSelector(selector);
  FunctionRequirements.updateRequirements(res);
  return req.requiredResources[selector.requirementName]?.items;
}
