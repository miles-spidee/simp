import { apiClient } from './api.client';
import { KPIMetric } from '../types/kpi.types';
import {} from '../types/kpis.types';

export const KPIApi = {
  getKPIs: async (): Promise<KPIMetric[]> => {
    try {
      const res = await apiClient.get('/api/v1/kpi');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  createKPI: async (kpi: Partial<KPIMetric>): Promise<KPIMetric> => {
    try {
      const res = await apiClient.post('/api/v1/kpi', kpi);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  updateKPI: async (id: string, updates: Partial<KPIMetric>): Promise<KPIMetric> => {
    try {
      const res = await apiClient.patch(`/api/v1/kpi/${id}`, updates);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
