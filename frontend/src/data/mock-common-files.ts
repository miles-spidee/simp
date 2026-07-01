export type FileType = 'PDF' | 'PPT' | 'ZIP' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export interface CommonFile {
  file_id: string;
  file_name: string;
  mime_type: string;
  file_type: FileType;
  file_size: number; // in bytes
  uploaded_by: string;
  uploaded_at: string;
  storage_url: string; // Simulated blob url
  version: number;
}

export interface FileReference {
  id: string;
  file_id: string;
  entity_type: 'Application' | 'LearningResource' | 'Submission' | 'Certificate' | string;
  entity_id: string;
}

export const MOCK_COMMON_FILES: CommonFile[] = [];

export const MOCK_FILE_REFERENCES: FileReference[] = [];
