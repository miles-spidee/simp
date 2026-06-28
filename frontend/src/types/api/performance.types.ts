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
