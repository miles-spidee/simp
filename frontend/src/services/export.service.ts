import { ExportApi } from '../api/export.api';

export const ExportService = {
  getExportJobs: () => ExportApi.getExportJobs(),
  getExportSchedules: () => ExportApi.getExportSchedules(),
};
