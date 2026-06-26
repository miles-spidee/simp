import { KPIMetric } from '../types/kpi.types';
import { MOCK_KPIS } from '../data/mock-kpis';

export const KPIApi = {
  getKPIs: async (): Promise<KPIMetric[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_KPIS), 600));
  }
};
