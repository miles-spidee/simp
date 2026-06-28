import { Task, TaskAssignee } from '../types/api/task.types';

export const MOCK_TASKS: Task[] = [
  {
    id: 'TSK-101',
    title: 'Build Authentication Microservice',
    description: 'Implement JWT-based authentication in Node.js with Redis caching.',
    batchId: 'batch-2',
    assignedBy: 'Alex Chen',
    assignedDate: '2023-11-10',
    dueDate: '2023-11-20',
    status: 'pending',
    isOverdue: true,
    isLocked: false,
    alert: 'Level 1 Escalation Active',
    fileIds: ['file-1']
  },
  {
    id: 'TSK-102',
    title: 'Frontend React Architecture Setup',
    description: 'Setup Vite, Tailwind, and React Router for the main app.',
    batchId: 'batch-1',
    assignedBy: 'Sarah Doe',
    assignedDate: '2023-10-01',
    dueDate: '2023-10-15',
    status: 'completed',
    isOverdue: false,
    isLocked: true
  },
  {
    id: 'TSK-103',
    title: 'API Gateway Integration',
    description: 'Route traffic through Kong gateway.',
    batchId: 'batch-2',
    assignedBy: 'Alex Chen',
    assignedDate: '2023-11-20',
    dueDate: '2023-12-05',
    status: 'review',
    isOverdue: false,
    isLocked: false
  }
];

export const MOCK_TASK_ASSIGNEES: TaskAssignee[] = [
  { taskId: 'TSK-101', studentId: 'stu-1', status: 'pending' },
  { taskId: 'TSK-102', studentId: 'stu-2', status: 'graded' }
];
