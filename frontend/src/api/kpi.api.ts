import { KPIMetric } from '../types/kpi.types';
import { MOCK_KPIS } from '../data/mock-kpis';

export const KPIApi = {
  getKPIs: async (): Promise<KPIMetric[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_KPIS]), 600));
  },

  createKPI: async (kpi: Partial<KPIMetric>): Promise<KPIMetric> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newKpi: KPIMetric = {
          id: `kpi_${MOCK_KPIS.length + 1}`,
          name: kpi.name || 'New KPI',
          category: kpi.category || 'General',
          currentValue: kpi.currentValue || 0,
          targetValue: kpi.targetValue || 100,
          unit: kpi.unit || '%',
          trend: kpi.trend || 'flat',
          trendPercentage: kpi.trendPercentage || 0,
          status: kpi.status || 'on_track',
          lastUpdated: new Date().toISOString()
        };
        MOCK_KPIS.push(newKpi);
        resolve(newKpi);
      }, 500);
    });
  },

  updateKPI: async (id: string, updates: Partial<KPIMetric>): Promise<KPIMetric> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const kpi = MOCK_KPIS.find(k => k.id === id);
        if (!kpi) {
          reject(new Error('KPI not found'));
          return;
        }
        Object.assign(kpi, updates);
        kpi.lastUpdated = new Date().toISOString();
        resolve(kpi);
      }, 505);
    });
  }
};
