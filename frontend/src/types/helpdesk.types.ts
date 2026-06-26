export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
export type TicketCategory = 'Technical Issue' | 'Attendance' | 'Assessment' | 'Payment' | 'Certificate' | 'Placement' | 'Login' | 'Bug Report' | 'Feature Request' | 'Infrastructure';

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  creatorName: string;
  assignedTo?: string;
  assigneeName?: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaBreach: boolean;
  slaDueDate: string;
  comments: TicketComment[];
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  views: number;
  helpfulCount: number;
}
