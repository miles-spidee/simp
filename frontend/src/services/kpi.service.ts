import { KPIApi } from '../api/kpi.api';
import { KPIMetric } from '../types/kpi.types';

export const KPIService = {
  getKPIs: () => KPIApi.getKPIs(),
  createKPI: (kpi: Partial<KPIMetric>) => KPIApi.createKPI(kpi),
  updateKPI: (id: string, updates: Partial<KPIMetric>) => KPIApi.updateKPI(id, updates)
};
