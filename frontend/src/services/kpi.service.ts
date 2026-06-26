import { KPIApi } from '../api/kpi.api';

export const KPIService = {
  getKPIs: () => KPIApi.getKPIs(),
};
