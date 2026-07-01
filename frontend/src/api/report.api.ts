import { apiClient } from './api.client';
import { ReportRecord, ReportTemplate } from '../types/report.types';
import {} from '../types/reports.types';

export const ReportApi = {
  getTemplates: async (): Promise<ReportTemplate[]> => {
    try {
      const res = await apiClient.get('/api/v1/report');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getReports: async (): Promise<ReportRecord[]> => {
    try {
      const res = await apiClient.get('/api/v1/report');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  generateReport: async (config: any): Promise<ReportRecord> => {
    try {
      const res = await apiClient.post('/api/v1/report/generate', config);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
