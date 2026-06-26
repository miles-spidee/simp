export interface ExportJob {
  id: string;
  module: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  requestedBy: string;
  requestedAt: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  fileUrl?: string;
}

export interface ExportSchedule {
  id: string;
  name: string;
  module: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  format: 'PDF' | 'Excel' | 'CSV';
  recipients: string[];
  nextRun: string;
}
