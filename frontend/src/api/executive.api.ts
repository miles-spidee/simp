import { apiClient } from './api.client';
import { ExecutiveMetric, RiskIndicator } from '../types/executive.types';
import {} from '../types/executive.types';

export const ExecutiveApi = {
  getMetrics: async (): Promise<ExecutiveMetric[]> => {
    try {
      const res = await apiClient.get('/api/v1/executive');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getRiskIndicators: async (): Promise<RiskIndicator[]> => {
    try {
      const res = await apiClient.get('/api/v1/executive');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
