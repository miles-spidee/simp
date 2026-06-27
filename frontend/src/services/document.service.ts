import { DocumentApi } from '../api/document.api';
import { GeneratedDocument } from '../types/document.types';

export const DocumentService = {
  getGeneratedDocuments: async () => {
    return await DocumentApi.getGeneratedDocuments();
  },
  
  getTemplates: async () => {
    return await DocumentApi.getTemplates();
  },
  
  getOfferLettersCount: async () => {
    const docs = await DocumentApi.getGeneratedDocuments();
    return docs.filter(d => d.type === 'Offer Letter').length;
  },

  createGeneratedDocument: async (doc: Partial<GeneratedDocument>) => {
    return await DocumentApi.createGeneratedDocument(doc);
  },

  updateDocumentStatus: async (id: string, status: 'Draft' | 'Generated' | 'Sent' | 'Signed') => {
    return await DocumentApi.updateDocumentStatus(id, status);
  }
};
