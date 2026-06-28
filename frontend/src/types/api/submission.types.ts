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

export type SubmissionCreate = Omit<Submission, 'id' | 'status'>;
export type SubmissionUpdate = Partial<Submission>;
