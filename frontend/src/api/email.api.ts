import { apiClient } from './api.client';
import { EmailTemplate, EmailHistory } from '../types/email.types';
import {} from '../types/email-templates.types';


export const emailApi = {
  getTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      const res = await apiClient.get('/api/v1/email');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getHistory: async (): Promise<EmailHistory[]> => {
    try {
      const res = await apiClient.get('/api/v1/email');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  saveTemplate: async (data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    try {
      const res = await apiClient.get('/api/v1/email');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
