import { FEATURE_REGISTRY } from '../core/features/feature-registry';

export const ROUTE_MODULE_MAP: Record<string, string> = {};

FEATURE_REGISTRY.forEach(feature => {
  if (feature.route) {
    ROUTE_MODULE_MAP[feature.route] = feature.moduleId;
  }
});
