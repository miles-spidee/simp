import { ProductivityWorkspace } from '../types/productivity.types';

export const MOCK_PRODUCTIVITY: ProductivityWorkspace = {
  bookmarks: [
    { id: 'BM-1', title: 'Pinesphere Intranet', url: 'https://intranet.pinesphere.com', category: 'Work' },
    { id: 'BM-2', title: 'React Documentation', url: 'https://react.dev', category: 'Learning' },
    { id: 'BM-3', title: 'Design System', url: 'https://design.pinesphere.com', category: 'Assets' }
  ],
  notes: [
    { id: 'NOTE-1', content: 'Remember to submit the weekly status report by EOD Friday.', color: 'yellow', createdAt: new Date().toISOString() },
    { id: 'NOTE-2', content: 'Review the new API contracts for Phase 7 implementation.', color: 'blue', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  tasks: [
    { id: 'PT-1', title: 'Complete onboarding modules', completed: false, dueDate: new Date(Date.now() + 86400000).toISOString() },
    { id: 'PT-2', title: 'Setup local development environment', completed: true, dueDate: new Date(Date.now() - 86400000).toISOString() },
    { id: 'PT-3', title: 'Schedule 1:1 with Mentor', completed: false, dueDate: new Date(Date.now() + 172800000).toISOString() }
  ]
};
