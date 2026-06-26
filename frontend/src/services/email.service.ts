import { emailApi } from '../api/email.api';
import { EmailTemplate, EmailHistory } from '../types/email.types';

export class EmailService {
  static async getTemplates(): Promise<EmailTemplate[]> {
    return emailApi.getTemplates();
  }

  static async getActiveTemplates(): Promise<EmailTemplate[]> {
    const templates = await emailApi.getTemplates();
    return templates.filter(t => t.status === 'Active');
  }

  static async getHistory(): Promise<EmailHistory[]> {
    return emailApi.getHistory();
  }

  static async getDeliveryStats(): Promise<{ delivered: number, bounced: number }> {
    const history = await emailApi.getHistory();
    return {
      delivered: history.filter(h => h.status === 'Delivered' || h.status === 'Opened' || h.status === 'Clicked').length,
      bounced: history.filter(h => h.status === 'Bounced').length
    };
  }

  static async saveTemplate(data: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return emailApi.saveTemplate(data);
  }
}
