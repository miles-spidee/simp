import { FinanceAnalytics } from '../types/finance-analytics.types';
import { MOCK_FINANCE_ANALYTICS } from '../data/mock-finance-analytics';

export const financeAnalyticsApi = {
  getAnalytics: async (): Promise<FinanceAnalytics> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_FINANCE_ANALYTICS), 600));
  }
};
