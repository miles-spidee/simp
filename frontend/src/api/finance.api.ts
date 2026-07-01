import { FinanceMetrics } from '../types/finance.types';
import { MOCK_FINANCE_METRICS } from '../data/mock-finance';

export const financeApi = {
  getDashboardMetrics: async (): Promise<FinanceMetrics> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_FINANCE_METRICS), 600));
  }
};
