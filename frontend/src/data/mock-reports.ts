import { ReportRecord, ReportTemplate } from '../types/report.types';

export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = [];

export const MOCK_REPORTS: ReportRecord[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `rep_${i + 1}`,
  name: `Report_${MOCK_REPORT_TEMPLATES[i % 4].name.replace(/\s+/g, '_')}_${new Date(Date.now() - i * 86400000).toISOString().split('T')[0]}`,
  type: MOCK_REPORT_TEMPLATES[i % 4].category,
  generatedBy: `User ${i % 5 + 1}`,
  generatedDate: new Date(Date.now() - i * 86400000).toISOString(),
  status: i === 0 ? 'Processing' : 'Completed',
  format: i % 3 === 0 ? 'PDF' : i % 3 === 1 ? 'Excel' : 'CSV',
  sizeBytes: Math.floor(Math.random() * 5000000) + 100000,
  downloadUrl: '#'
}));
