import { ResourceSelector } from './interfaces';
import { RunFunctionResponse } from './gen/proto/run_function';

export class FunctionRequirements {
  static selectors: Map<string, ResourceSelector> = new Map();

  static isExist(selector: ResourceSelector): boolean {
    return this.selectors.has(selector.requirementName);
  }

  static registerSelector(selector: ResourceSelector): void {
    const hasName = Boolean(selector.matchName);
    const hasLabels = Boolean(selector.matchLabels);
    if (hasName === hasLabels) {
      throw new Error('Invalid ResourceSelector: Either name or matchLabels must be specified, but not both');
    }
    FunctionRequirements.selectors.set(selector.requirementName, selector);
  }

  static updateRequirements(res: RunFunctionResponse): void {
    const requirements = res.requirements || { resources: {}, extraResources: {} };
    for (const selector of FunctionRequirements.selectors.values()) {
      requirements.resources[selector.requirementName] = {
        apiVersion: selector.apiVersion,
        kind: selector.kind,
        namespace: selector.namespace,
        matchName: selector.matchName,
        matchLabels: {
          labels: { ...selector.matchLabels }
        }
      };
    }
    res.requirements = requirements;
  }
}
