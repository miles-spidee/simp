export interface CoordinatorStats {
  totalStudents: number;
  activeBatches: number;
  averageAttendance: number;
  pendingAssessments: number;
}

export interface BatchPerformance {
  batchId: string;
  program: string;
  studentCount: number;
  avgScore: number;
  status: 'On Track' | 'At Risk' | 'Completed';
}