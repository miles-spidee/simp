import { ExportJob, ExportSchedule } from '../types/export.types';
import { MOCK_EXPORT_JOBS, MOCK_EXPORT_SCHEDULES } from '../data/mock-exports';

export const ExportApi = {
  getExportJobs: async (): Promise<ExportJob[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_EXPORT_JOBS), 600));
  },
  getExportSchedules: async (): Promise<ExportSchedule[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_EXPORT_SCHEDULES), 600));
  }
};
