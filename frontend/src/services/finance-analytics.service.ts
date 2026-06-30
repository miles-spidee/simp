import { financeAnalyticsApi } from '../api/finance-analytics.api';
import { FinanceAnalytics } from '../types/finance-analytics.types';

class FinanceAnalyticsService {
  async getAnalytics(): Promise<FinanceAnalytics> {
    return await financeAnalyticsApi.getAnalytics();
  }
}

export const financeAnalyticsService = new FinanceAnalyticsService();
