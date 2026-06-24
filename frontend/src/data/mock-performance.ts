export interface StudentPerformance {
  studentId: string;
  batchId: string;
  average_score: number;
  attendance_rate: number;
  task_completion_rate: number;
  assessment_score: number;
  isAtRisk: boolean;
}

export interface BatchPerformance {
  batchId: string;
  average_score: number;
  attendance_rate: number;
  task_completion_rate: number;
  assessment_score: number;
}

export const MOCK_STUDENT_PERFORMANCE: StudentPerformance[] = [
  { studentId: 'stu-1', batchId: 'batch-1', average_score: 88, attendance_rate: 95, task_completion_rate: 90, assessment_score: 85, isAtRisk: false },
  { studentId: 'stu-2', batchId: 'batch-1', average_score: 45, attendance_rate: 60, task_completion_rate: 40, assessment_score: 50, isAtRisk: true },
  { studentId: 'stu-3', batchId: 'batch-2', average_score: 92, attendance_rate: 100, task_completion_rate: 100, assessment_score: 88, isAtRisk: false }
];

export const MOCK_BATCH_PERFORMANCE: BatchPerformance[] = [
  { batchId: 'batch-1', average_score: 66, attendance_rate: 77, task_completion_rate: 65, assessment_score: 67 },
  { batchId: 'batch-2', average_score: 92, attendance_rate: 100, task_completion_rate: 100, assessment_score: 88 }
];
