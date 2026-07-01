import { GeneratedDocument, DocumentTemplate } from '../types/document.types';

export const MOCK_DOCUMENT_TEMPLATES: DocumentTemplate[] = [];

export const MOCK_GENERATED_DOCUMENTS: GeneratedDocument[] = Array.from({ length: 500 }).map((_, i) => {
  const statuses: any[] = ['Draft', 'Generated', 'Sent', 'Signed'];
  return {
    id: `doc_${i + 1}`,
    templateId: i % 2 === 0 ? 'tpl_1' : 'tpl_2',
    studentId: `std_${(i % 100) + 1}`,
    studentName: `Student ${i + 1}`,
    program: 'Full Stack Web Development',
    type: i % 2 === 0 ? 'Offer Letter' : 'Completion Certificate',
    status: statuses[i % statuses.length],
    generatedDate: new Date(Date.now() - i * 3600000).toISOString(),
    version: 'v1.0',
    fileUrl: `https://example.com/documents/doc_${i + 1}.pdf`,
    metadata: {
      generatedBy: 'System Auto-Generator',
      stipend: '15000'
    }
  };
});
