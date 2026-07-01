import { apiClient } from './api.client';
import { FinanceMetrics } from '../types/finance.types';
import {} from '../types/finance.types';

export const financeApi = {
  getDashboardMetrics: async (): Promise<FinanceMetrics> => {
    try {
      const res = await apiClient.get('/api/v1/finance');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
