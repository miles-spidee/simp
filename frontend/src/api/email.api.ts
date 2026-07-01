import { EmailTemplate, EmailHistory } from '../types/email.types';
import { MOCK_EMAIL_TEMPLATES, MOCK_EMAIL_HISTORY } from '../data/mock-email-templates';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const emailApi = {
  getTemplates: async (): Promise<EmailTemplate[]> => {
    await delay(500);
    return [...MOCK_EMAIL_TEMPLATES].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  },
  getHistory: async (): Promise<EmailHistory[]> => {
    await delay(700);
    return [...MOCK_EMAIL_HISTORY].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  },
  saveTemplate: async (data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    await delay(400);
    let template = MOCK_EMAIL_TEMPLATES.find(t => t.id === data.id);
    if (template) {
      Object.assign(template, { ...data, lastUpdated: new Date().toISOString(), version: template.version + 1 });
    } else {
      template = {
        id: `tpl-${MOCK_EMAIL_TEMPLATES.length + 1}`,
        name: data.name || '',
        category: data.category || 'General' as any,
        subject: data.subject || '',
        htmlBody: data.htmlBody || '',
        variables: data.variables || [],
        status: data.status || 'Draft',
        createdBy: data.createdBy || 'Current User',
        version: 1,
        lastUpdated: new Date().toISOString()
      };
      MOCK_EMAIL_TEMPLATES.push(template);
    }
    return template;
  }
};
