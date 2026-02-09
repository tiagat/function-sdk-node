import { Ready, Resource, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';
import { ResourceSelector } from './interfaces';
import { FunctionRequirements } from './function-requirements';

export function requiredResource(req: RunFunctionRequest, res: RunFunctionResponse, selector: ResourceSelector): Resource[] | undefined {
  FunctionRequirements.registerSelector(selector);
  FunctionRequirements.updateRequirements(res);
  return req.requiredResources[selector.requirementName]?.items;
}

export function composedResource(
  req: RunFunctionRequest,
  res: RunFunctionResponse,
  name: string,
  resource: Record<string, unknown>
): Resource | undefined {
  const composed: Resource = {
    resource: { ...resource },
    connectionDetails: {},
    ready: Ready.READY_TRUE
  };

  const existing = req.observed?.resources[name] || {};
  const combined = Object.assign({}, existing, composed);

  if (!res.desired) {
    res.desired = { resources: {} };
  }

  res.desired.resources[name] = combined;

  return combined;
}
