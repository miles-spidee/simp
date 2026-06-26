import { Ticket, KnowledgeBaseArticle } from '../types/helpdesk.types';
import { MOCK_TICKETS, MOCK_KB_ARTICLES } from '../data/mock-tickets';

const DELAY = 500;

export const HelpdeskAPI = {
  getTickets: async (): Promise<Ticket[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_TICKETS]), DELAY);
    });
  },
  
  getTicketById: async (id: string): Promise<Ticket | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = MOCK_TICKETS.find(t => t.id === id);
        resolve(ticket || null);
      }, DELAY);
    });
  },

  getKBArticles: async (): Promise<KnowledgeBaseArticle[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_KB_ARTICLES]), DELAY);
    });
  }
};
