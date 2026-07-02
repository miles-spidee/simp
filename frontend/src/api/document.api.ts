import { apiClient } from './api.client';
import { GeneratedDocument, DocumentTemplate } from '../types/document.types';
import {} from '../types/documents.types';


export const DocumentApi = {
  getGeneratedDocuments: async (): Promise<GeneratedDocument[]> => {
    try {
      const res = await apiClient.get('/api/v1/document');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getTemplates: async (): Promise<DocumentTemplate[]> => {
    try {
      const res = await apiClient.get('/api/v1/document/templates');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  createGeneratedDocument: async (doc: Partial<GeneratedDocument>): Promise<GeneratedDocument> => {
    try {
      const res = await apiClient.post('/api/v1/document', doc);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  updateDocumentStatus: async (id: string, status: 'Draft' | 'Generated' | 'Sent' | 'Signed'): Promise<GeneratedDocument> => {
    try {
      const res = await apiClient.patch(`/api/v1/document/${id}/status`, { status });
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
