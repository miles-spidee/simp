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

export const MOCK_ASSESSMENTS: Assessment[] = [
  { id: 'asm-1', title: 'React Architecture Prep', assessmentType: 'MCQ', batchId: 'batch-1', totalMarks: 100, passingMarks: 75, date: '2023-12-01', status: 'Upcoming' },
  { id: 'asm-2', title: 'Node.js Backend Implementation', assessmentType: 'Coding', batchId: 'batch-2', totalMarks: 100, passingMarks: 60, date: '2023-11-20', status: 'Active' },
  { id: 'asm-3', title: 'Final Capstone Project', assessmentType: 'Project', batchId: 'batch-1', totalMarks: 200, passingMarks: 120, date: '2023-11-10', status: 'Completed', fileIds: ['file-1'] }
];

export const MOCK_ASSESSMENT_SUBMISSIONS: AssessmentSubmission[] = [
  { id: 'sub-1', assessmentId: 'asm-3', studentId: 'stu-1', score: 180, status: 'Graded', submittedAt: '2023-11-09T14:30:00Z', fileIds: ['file-3'] },
  { id: 'sub-2', assessmentId: 'asm-2', studentId: 'stu-2', status: 'Pending Grading', submittedAt: '2023-11-20T10:00:00Z' },
  { id: 'sub-3', assessmentId: 'asm-3', studentId: 'stu-3', status: 'Missed' }
];
