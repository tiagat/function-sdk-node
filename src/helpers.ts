import { Resource, RunFunctionRequest, RunFunctionResponse } from './gen/proto/run_function';
import { ResourceSelector } from './interfaces';

export function requiredResource(selector: ResourceSelector, req: RunFunctionRequest, res: RunFunctionResponse): Resource[] | undefined {
  const hasName = Boolean(selector.matchName);
  const hasLabels = Boolean(selector.matchLabels);
  if (hasName === hasLabels) {
    throw new Error('Invalid ResourceSelector: Either name or matchLabels must be specified, but not both');
  }

  if (!res.requirements) {
    res.requirements = { resources: {}, extraResources: {} };
  }

  res.requirements.resources[selector.requirementName] = {
    apiVersion: selector.apiVersion,
    kind: selector.kind,
    namespace: selector.namespace,
    matchName: selector.matchName,
    matchLabels: {
      labels: { ...selector.matchLabels }
    }
  };

  return req.requiredResources[selector.requirementName]?.items;
}
