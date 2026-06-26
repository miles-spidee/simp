import { Ticket, KnowledgeBaseArticle } from '../types/helpdesk.types';

export const MOCK_TICKETS: Ticket[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `TKT-${1000 + i}`,
  ticketNumber: `TK-${new Date().getFullYear()}-${1000 + i}`,
  title: `Issue with ${['login', 'attendance tracking', 'certificate generation', 'payment gateway', 'assessment portal'][i % 5]}`,
  description: 'I am facing an issue while trying to access the specified module. It shows a 500 error.',
  category: ['Technical Issue', 'Attendance', 'Assessment', 'Payment', 'Certificate', 'Login'][i % 6] as any,
  priority: ['Low', 'Medium', 'High', 'Critical'][i % 4] as any,
  status: ['Open', 'Assigned', 'In Progress', 'Waiting', 'Resolved', 'Closed'][i % 6] as any,
  createdBy: `USR-${2000 + i}`,
  creatorName: `Student ${i}`,
  assignedTo: i % 2 === 0 ? `EMP-${3000 + i}` : undefined,
  assigneeName: i % 2 === 0 ? `Support Agent ${i % 5}` : undefined,
  department: ['IT Support', 'HR', 'Finance', 'Academics'][i % 4],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date().toISOString(),
  slaBreach: i % 7 === 0,
  slaDueDate: new Date(Date.now() + 86400000).toISOString(),
  comments: [
    {
      id: `COM-${i}-1`,
      ticketId: `TKT-${1000 + i}`,
      authorId: `USR-${2000 + i}`,
      authorName: `Student ${i}`,
      content: 'Please look into this ASAP.',
      timestamp: new Date().toISOString(),
      isInternal: false
    }
  ]
}));

export const MOCK_KB_ARTICLES: KnowledgeBaseArticle[] = [
  { id: 'KB-1', title: 'How to reset your password', category: 'Login', content: 'Go to the login page and click forgot password.', views: 1250, helpfulCount: 890 },
  { id: 'KB-2', title: 'Understanding your payslip', category: 'Payment', content: 'Payslips are generated on the 1st of every month.', views: 800, helpfulCount: 450 },
  { id: 'KB-3', title: 'How to download your certificate', category: 'Certificate', content: 'Navigate to Self-Service > Certificates and click Download.', views: 3200, helpfulCount: 2100 },
];
