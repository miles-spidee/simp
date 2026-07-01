import { Ticket, KnowledgeBaseArticle, TicketComment, TicketStatus } from '../types/helpdesk.types';
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
  },

  createTicket: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTicket: Ticket = {
          id: `TKT-${1000 + MOCK_TICKETS.length}`,
          ticketNumber: `TK-${new Date().getFullYear()}-${1000 + MOCK_TICKETS.length}`,
          title: ticket.title || 'Untitled Ticket',
          description: ticket.description || '',
          category: ticket.category || 'Technical Issue',
          priority: ticket.priority || 'Medium',
          status: 'Open',
          createdBy: ticket.createdBy || '0',
          creatorName: ticket.creatorName || 'User',
          department: ticket.department || 'IT Support',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          slaBreach: false,
          slaDueDate: new Date(Date.now() + 86400000).toISOString(),
          comments: []
        };
        MOCK_TICKETS.unshift(newTicket);
        resolve(newTicket);
      }, DELAY);
    });
  },

  addComment: async (ticketId: string, authorId: string, authorName: string, content: string): Promise<TicketComment> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
        if (!ticket) {
          reject(new Error('Ticket not found'));
          return;
        }
        const comment: TicketComment = {
          id: `COM-${ticketId}-${ticket.comments.length + 1}`,
          ticketId,
          authorId,
          authorName,
          content,
          timestamp: new Date().toISOString(),
          isInternal: false
        };
        ticket.comments.push(comment);
        ticket.updatedAt = new Date().toISOString();
        resolve(comment);
      }, DELAY);
    });
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus, assigneeId?: string, assigneeName?: string): Promise<Ticket> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
        if (!ticket) {
          reject(new Error('Ticket not found'));
          return;
        }
        ticket.status = status;
        if (assigneeId) {
          ticket.assignedTo = assigneeId;
          ticket.assigneeName = assigneeName;
        }
        ticket.updatedAt = new Date().toISOString();
        resolve(ticket);
      }, DELAY);
    });
  }
};
