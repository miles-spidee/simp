import { apiClient } from './api.client';
import { FinanceAnalytics } from '../types/finance-analytics.types';
import {} from '../types/finance-analytics.types';

export const financeAnalyticsApi = {
  getAnalytics: async (): Promise<FinanceAnalytics> => {
    try {
      const res = await apiClient.get('/api/v1/finance-analytics');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
