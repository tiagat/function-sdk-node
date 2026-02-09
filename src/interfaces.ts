export interface ResourceSelector {
  requirementName: string;
  apiVersion: string;
  kind: string;
  namespace?: string;
  matchName?: string;
  matchLabels?: Record<string, string>;
}
