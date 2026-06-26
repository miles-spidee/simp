import { ReportRecord, ReportTemplate } from '../types/report.types';
import { MOCK_REPORTS, MOCK_REPORT_TEMPLATES } from '../data/mock-reports';

export const ReportApi = {
  getTemplates: async (): Promise<ReportTemplate[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_REPORT_TEMPLATES), 500));
  },
  getReports: async (): Promise<ReportRecord[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_REPORTS), 700));
  },
  generateReport: async (templateId: string): Promise<ReportRecord> => {
    return new Promise((resolve) => setTimeout(() => resolve({
      id: `rep_new_${Date.now()}`,
      name: `Generated_Report_${Date.now()}`,
      type: 'Custom',
      generatedBy: 'Current User',
      generatedDate: new Date().toISOString(),
      status: 'Processing',
      format: 'PDF',
      sizeBytes: 0,
      downloadUrl: '#'
    }), 1000));
  }
};
