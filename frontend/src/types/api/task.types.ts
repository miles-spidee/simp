export interface Task {
  id: string;
  title: string;
  description: string;
  batchId: string;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'review' | 'completed';
  isOverdue: boolean;
  isLocked: boolean;
  alert?: string;
  fileIds?: string[];
}

export interface TaskAssignee {
  taskId: string;
  studentId: string;
  status: 'pending' | 'submitted' | 'graded';
}
