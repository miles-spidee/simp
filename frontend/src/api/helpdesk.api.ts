import { apiClient } from './api.client';
import { Ticket, KnowledgeBaseArticle, TicketComment, TicketStatus } from '../types/helpdesk.types';
import {} from '../types/tickets.types';

const DELAY = 500;

export const HelpdeskAPI = {
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const res = await apiClient.get('/api/v1/helpdesk');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getTicketById: async (id: string): Promise<Ticket | null> => {
    try {
      const res = await apiClient.get('/api/v1/helpdesk');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  getKBArticles: async (): Promise<KnowledgeBaseArticle[]> => {
    try {
      const res = await apiClient.get('/api/v1/helpdesk');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  createTicket: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    try {
      const res = await apiClient.post('/api/v1/helpdesk');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  addComment: async (ticketId: string, authorId: string, authorName: string, content: string): Promise<TicketComment> => {
    try {
      const res = await apiClient.post('/api/v1/helpdesk');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus, assigneeId?: string, assigneeName?: string): Promise<Ticket> => {
    try {
      const res = await apiClient.patch('/api/v1/helpdesk');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
