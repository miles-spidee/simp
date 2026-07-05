import { EmailTemplate, EmailHistory } from '../types/email.types';

const MOCK_TEMPLATES: EmailTemplate[] = [
  { 
    id: '1', 
    name: 'Welcome Email', 
    subject: 'Welcome to Pinesphere', 
    category: 'Registration', 
    htmlBody: '<h1>Welcome to the portal!</h1>', 
    status: 'Active', 
    variables: ['{{studentName}}'], 
    createdBy: 'System',
    version: 1,
    lastUpdated: new Date().toISOString() 
  }
];

const getStoredTemplates = (): EmailTemplate[] => {
  if (typeof window === 'undefined') return MOCK_TEMPLATES;
  try {
    const stored = localStorage.getItem('email_templates_mock');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('email_templates_mock', JSON.stringify(MOCK_TEMPLATES));
    return MOCK_TEMPLATES;
  } catch {
    return MOCK_TEMPLATES;
  }
};

export const emailApi = {
  getTemplates: async (): Promise<EmailTemplate[]> => {
    return getStoredTemplates();
  },
  getHistory: async (): Promise<EmailHistory[]> => {
    return [];
  },
  saveTemplate: async (data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    if (typeof window === 'undefined') return null as any;
    const templates = getStoredTemplates();
    
    if (data.id) {
      const index = templates.findIndex(t => t.id === data.id);
      if (index > -1) {
        templates[index] = { ...templates[index], ...data, lastUpdated: new Date().toISOString() };
        localStorage.setItem('email_templates_mock', JSON.stringify(templates));
        return templates[index];
      }
    }
    
    const newTemplate: EmailTemplate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdBy: 'Admin',
      version: 1,
      lastUpdated: new Date().toISOString(),
    } as EmailTemplate;
    
    templates.unshift(newTemplate);
    localStorage.setItem('email_templates_mock', JSON.stringify(templates));
    return newTemplate;
  }
};
