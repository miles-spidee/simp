import { DocumentApi } from '../api/document.api';

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
  }
};
