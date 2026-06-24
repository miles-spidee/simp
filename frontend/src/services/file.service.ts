import { CommonFile, FileReference, MOCK_COMMON_FILES, MOCK_FILE_REFERENCES } from '../data/mock-common-files';

class FileService {
  private files: CommonFile[] = [...MOCK_COMMON_FILES];
  private references: FileReference[] = [...MOCK_FILE_REFERENCES];

  async getFiles(): Promise<CommonFile[]> {
    return [...this.files];
  }

  async getFile(fileId: string): Promise<CommonFile | undefined> {
    return this.files.find(f => f.file_id === fileId);
  }

  async uploadFile(file: Partial<CommonFile>): Promise<CommonFile> {
    const newFile: CommonFile = {
      file_id: `file-${Date.now()}`,
      file_name: file.file_name || 'unnamed_file',
      mime_type: file.mime_type || 'application/octet-stream',
      file_type: file.file_type || 'DOCUMENT',
      file_size: file.file_size || 0,
      uploaded_by: file.uploaded_by || 'current-user',
      uploaded_at: new Date().toISOString(),
      storage_url: file.storage_url || `/mock-storage/file-${Date.now()}`,
      version: 1,
      ...file
    };
    this.files.push(newFile);
    return newFile;
  }

  async deleteFile(fileId: string): Promise<void> {
    this.files = this.files.filter(f => f.file_id !== fileId);
    this.references = this.references.filter(r => r.file_id !== fileId);
  }

  async addReference(fileId: string, entityType: string, entityId: string): Promise<FileReference> {
    const newRef: FileReference = {
      id: `ref-${Date.now()}`,
      file_id: fileId,
      entity_type: entityType,
      entity_id: entityId
    };
    this.references.push(newRef);
    return newRef;
  }

  async getReferencesForEntity(entityType: string, entityId: string): Promise<CommonFile[]> {
    const refs = this.references.filter(r => r.entity_type === entityType && r.entity_id === entityId);
    return refs.map(r => this.files.find(f => f.file_id === r.file_id)).filter(Boolean) as CommonFile[];
  }
}

export const fileService = new FileService();
