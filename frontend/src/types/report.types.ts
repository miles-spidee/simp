export interface ReportRecord {
  id: string;
  name: string;
  type: string;
  generatedBy: string;
  generatedDate: string;
  status: 'Completed' | 'Processing' | 'Failed';
  format: 'PDF' | 'Excel' | 'CSV';
  sizeBytes: number;
  downloadUrl: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
}
