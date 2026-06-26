import { financeApi } from '../api/finance.api';

class FinanceService {
  async getDashboardMetrics() {
    return await financeApi.getDashboardMetrics();
  }
}

export const financeService = new FinanceService();
