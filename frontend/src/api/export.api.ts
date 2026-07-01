import { apiClient } from './api.client';
import { ExportJob, ExportSchedule } from '../types/export.types';
import {} from '../types/exports.types';

export const ExportApi = {
  getExportJobs: async (): Promise<ExportJob[]> => {
    try {
      const res = await apiClient.get('/api/v1/export');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getExportSchedules: async (): Promise<ExportSchedule[]> => {
    try {
      const res = await apiClient.get('/api/v1/export');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
