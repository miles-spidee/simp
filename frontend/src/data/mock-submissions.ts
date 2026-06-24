export interface Subtask {
  id: string;
  phase: number;
  task: string;
  completed: boolean;
}

export interface Commit {
  commit: string;
  message: string;
  author: string;
  date: string;
  guideComment?: string;
}

export interface Submission {
  id: string;
  studentId: string;
  taskId?: string;
  assessmentId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  repoLink: string;
  liveLink: string;
  subtasks: Subtask[];
  commits: Commit[];
  submissionDate?: string;
  marksObtained?: number;
  fileIds?: string[];
}

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    studentId: 'stu-1',
    status: 'PENDING',
    repoLink: 'https://github.com/stu-1/erp-capstone',
    liveLink: 'https://erp-capstone-stu1.vercel.app',
    subtasks: [
      { id: 'st-1', phase: 3, task: 'Implement Redux State Architecture', completed: true },
      { id: 'st-2', phase: 3, task: 'Build Mentor & Batch Allocation UI', completed: true },
      { id: 'st-3', phase: 4, task: 'Connect to Mock Server Endpoints', completed: false },
      { id: 'st-4', phase: 4, task: 'Deploy Client build on Vercel', completed: false }
    ],
    commits: [
      { commit: 'f9d3b2a', message: 'Initial commit: Next.js boilerplate setup', author: 'stu-1', date: 'Oct 12, 10:45 AM' },
      { commit: 'a1b2c3d', message: 'feat: Redux store configured', author: 'stu-1', date: 'Oct 14, 02:30 PM', guideComment: 'Good structure, ensure you use slices.' },
      { commit: 'e5f6g7h', message: 'feat: Basic Mentor UI layout', author: 'stu-1', date: 'Oct 16, 11:20 AM' }
    ],
    fileIds: ['file-1', 'file-3']
  }
];
