// ─── Existing types (kept for backward compat) ──────────────────────────────

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

// ─── New real-API types ───────────────────────────────────────────────────────

export interface RMBatch {
  batch_id: string;
  batch_name: string;
  batch_code: string;
  program_id: string;
  program_name: string;
  start_date: string;
  end_date: string;
  max_capacity: number;
  student_count: number;
}

export interface RMStudent {
  student_profile_id: string;
  user_id: string | null;
  enrollment_number: string;
  name: string;
  email: string;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
}

export interface RMMentor {
  mentor_profile_id: string;
  user_id: string | null;
  name: string;
  email: string;
  expertise: string | null;
  years_of_experience: number | null;
  is_available: boolean;
  assigned_student_count: number;
}
