export type AssessmentType = 'MCQ' | 'Coding' | 'Project';

export interface Assessment {
  id: string;
  title: string;
  assessmentType: AssessmentType;
  batchId: string;
  totalMarks: number;
  passingMarks: number;
  date: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  fileIds?: string[];
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  score?: number;
  status: 'Pending Grading' | 'Graded' | 'Missed';
  submittedAt?: string;
  fileIds?: string[];
}
