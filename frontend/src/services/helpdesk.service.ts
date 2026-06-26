import { HelpdeskAPI } from '../api/helpdesk.api';
import { Ticket, KnowledgeBaseArticle } from '../types/helpdesk.types';

export class HelpdeskService {
  static async getTickets(): Promise<Ticket[]> {
    const tickets = await HelpdeskAPI.getTickets();
    return tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async getMyTickets(userId: string): Promise<Ticket[]> {
    const tickets = await HelpdeskAPI.getTickets();
    return tickets.filter(t => t.createdBy === userId || t.assignedTo === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async getTicketById(id: string): Promise<Ticket | null> {
    return HelpdeskAPI.getTicketById(id);
  }

  static async getKnowledgeBase(): Promise<KnowledgeBaseArticle[]> {
    return HelpdeskAPI.getKBArticles();
  }
}
