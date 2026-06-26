export interface ReportingManager {
  id: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  assignedInternsCount: number;
  status: 'Active' | 'Inactive';
}

export interface ManagerAssignment {
  id: string;
  managerId: string;
  internId: string;
  assignedDate: string;
  status: 'Active' | 'Completed' | 'Revoked';
  internName: string;
  batch: string;
  college: string;
  attendancePercent: number;
  assessmentPercent: number;
  taskCompletionPercent: number;
  performanceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ManagerEvaluation {
  id: string;
  assignmentId: string;
  managerId: string;
  internId: string;
  evaluationDate: string;
  score: number;
  feedback: string;
  status: 'Draft' | 'Submitted';
}
