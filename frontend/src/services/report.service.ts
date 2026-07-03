import { ReportApi } from '../api/report.api';

export const ReportService = {
  getTemplates: () => ReportApi.getTemplates(),
  getReports: () => ReportApi.getReports(),
  generateReport: (templateId: string, format: string = 'PDF') => ReportApi.generateReport(templateId, format),
};
