import { GeneratedDocument, DocumentTemplate } from '../types/document.types';

const getStoredDocs = (): GeneratedDocument[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('doc_mock');
    if (stored) return JSON.parse(stored);
    return [];
  } catch {
    return [];
  }
};

export const DocumentApi = {
  getGeneratedDocuments: async (): Promise<GeneratedDocument[]> => {
    return getStoredDocs();
  },
  
  getTemplates: async (): Promise<DocumentTemplate[]> => {
    return [];
  },

  createGeneratedDocument: async (doc: Partial<GeneratedDocument>): Promise<GeneratedDocument> => {
    if (typeof window === 'undefined') return null as any;
    const docs = getStoredDocs();
    
    const newDoc: GeneratedDocument = {
      ...doc,
      id: Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
      url: '#',
      status: 'Generated',
    } as GeneratedDocument;
    
    docs.unshift(newDoc);
    localStorage.setItem('doc_mock', JSON.stringify(docs));
    return newDoc;
  },

  updateDocumentStatus: async (id: string, status: 'Draft' | 'Generated' | 'Sent' | 'Signed'): Promise<GeneratedDocument> => {
    if (typeof window === 'undefined') return null as any;
    const docs = getStoredDocs();
    const index = docs.findIndex(d => d.id === id);
    if (index > -1) {
      docs[index].status = status;
      localStorage.setItem('doc_mock', JSON.stringify(docs));
      return docs[index];
    }
    return null as any;
  }
};
