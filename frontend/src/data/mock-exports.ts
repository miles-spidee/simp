import { ExportJob, ExportSchedule } from '../types/export.types';

export const MOCK_EXPORT_JOBS: ExportJob[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `expjob_${i + 1}`,
  module: i % 2 === 0 ? 'Finance' : 'Placements',
  format: i % 3 === 0 ? 'Excel' : 'CSV',
  requestedBy: 'System Administrator',
  requestedAt: new Date(Date.now() - i * 3600000).toISOString(),
  status: i === 0 ? 'Processing' : 'Completed',
  fileUrl: i === 0 ? undefined : 'https://example.com/download'
}));

export const MOCK_EXPORT_SCHEDULES: ExportSchedule[] = [];
