export type DocumentStatus = 'Draft' | 'Generated' | 'Sent' | 'Signed';
export type DocumentType = 'Offer Letter' | 'Joining Letter' | 'Internship Letter' | 'Completion Certificate' | 'Recommendation Letter' | 'Evaluation Report' | 'Performance Report' | 'Attendance Report';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  description: string;
  version: string;
  variables: string[];
  lastUpdated: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  studentId: string;
  studentName: string;
  program: string;
  type: DocumentType;
  status: DocumentStatus;
  generatedDate: string;
  version: string;
  fileUrl: string;
  metadata: Record<string, string>;
}
