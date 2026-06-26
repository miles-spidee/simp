import { ExecutiveMetric, RiskIndicator } from '../types/executive.types';
import { MOCK_EXECUTIVE_METRICS, MOCK_RISK_INDICATORS } from '../data/mock-executive';

export const ExecutiveApi = {
  getMetrics: async (): Promise<ExecutiveMetric[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_EXECUTIVE_METRICS), 500));
  },
  getRiskIndicators: async (): Promise<RiskIndicator[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_RISK_INDICATORS), 500));
  }
};
