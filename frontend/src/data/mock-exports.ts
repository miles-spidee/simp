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

export const MOCK_EXPORT_SCHEDULES: ExportSchedule[] = [
  { id: 'expsch_1', name: 'Weekly Finance Summary', module: 'Finance', frequency: 'Weekly', format: 'Excel', recipients: ['finance@pinesphere.com'], nextRun: new Date(Date.now() + 86400000 * 3).toISOString() },
  { id: 'expsch_2', name: 'Monthly Placement Report', module: 'Placements', frequency: 'Monthly', format: 'PDF', recipients: ['placements@pinesphere.com'], nextRun: new Date(Date.now() + 86400000 * 15).toISOString() },
];
