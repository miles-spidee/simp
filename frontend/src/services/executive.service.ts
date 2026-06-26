import { ExecutiveApi } from '../api/executive.api';

export const ExecutiveService = {
  getDashboardData: async () => {
    const [metrics, risks] = await Promise.all([
      ExecutiveApi.getMetrics(),
      ExecutiveApi.getRiskIndicators()
    ]);
    return { metrics, risks };
  }
};
