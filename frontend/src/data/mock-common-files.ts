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

export const MOCK_COMMON_FILES: CommonFile[] = [
  {
    file_id: 'file-1',
    file_name: 'React_Architecture_Guide.pdf',
    mime_type: 'application/pdf',
    file_type: 'PDF',
    file_size: 2500000,
    uploaded_by: 'emp-1',
    uploaded_at: '2023-11-01T10:00:00Z',
    storage_url: '/mock-storage/file-1.pdf',
    version: 1,
  },
  {
    file_id: 'file-2',
    file_name: 'Component_Lifecycle.mp4',
    mime_type: 'video/mp4',
    file_type: 'VIDEO',
    file_size: 150000000,
    uploaded_by: 'emp-2',
    uploaded_at: '2023-11-02T14:30:00Z',
    storage_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    version: 1,
  },
  {
    file_id: 'file-3',
    file_name: 'Node_Gateway_Setup.zip',
    mime_type: 'application/zip',
    file_type: 'ZIP',
    file_size: 45000000,
    uploaded_by: 'emp-1',
    uploaded_at: '2023-11-05T09:15:00Z',
    storage_url: '/mock-storage/file-3.zip',
    version: 1,
  }
];

export const MOCK_FILE_REFERENCES: FileReference[] = [
  { id: 'ref-1', file_id: 'file-1', entity_type: 'LearningResource', entity_id: 'res-1' },
  { id: 'ref-2', file_id: 'file-2', entity_type: 'LearningResource', entity_id: 'res-2' },
];
