import { GeneratedDocument, DocumentTemplate } from '../types/document.types';
import { MOCK_GENERATED_DOCUMENTS, MOCK_DOCUMENT_TEMPLATES } from '../data/mock-documents';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const DocumentApi = {
  getGeneratedDocuments: async (): Promise<GeneratedDocument[]> => {
    await delay(500);
    return MOCK_GENERATED_DOCUMENTS;
  },
  
  getTemplates: async (): Promise<DocumentTemplate[]> => {
    await delay(300);
    return MOCK_DOCUMENT_TEMPLATES;
  }
};
