import { ReportApi } from '../api/report.api';

export const ReportService = {
  getTemplates: () => ReportApi.getTemplates(),
  getReports: () => ReportApi.getReports(),
  generateReport: (templateId: string) => ReportApi.generateReport(templateId),
};
