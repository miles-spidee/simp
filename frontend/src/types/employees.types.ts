export interface EmployeeDocument {
  type: string;
  name: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  version: string;
  previewContent?: string;
}

export interface EmployeeAttendance {
  presentDays: number;
  absentDays: number;
  lateArrivals: number;
  totalHours: number;
}

export interface EmployeeLeave {
  available: number;
  used: number;
  pending: number;
  approved: number;
}

export interface MentorMetrics {
  assignedInterns: number;
  assignedEmployees: number;
  activeProjects: number;
  trainingSessions: number;
  interns: { id: string; name: string; batch: string }[];
  employees: { id: string; name: string; department: string }[];
  batchInfo: string;
  successRate: number; // percentage
  trainingHours: number;
  avgRating: number; // out of 5
  retentionRate: number; // percentage
}

export interface AccessControl {
  role: string;
  permissions: string[];
  moduleAccess: string[];
  securityPolicies: string[];
}

export interface AuditTrailEntry {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  details: string;
}

export interface PerformanceMetric {
  productivity: number; // out of 100
  communication: number; // out of 100
  leadership: number; // out of 100
  technical: number; // out of 100
  attendance: number; // out of 100
  learningProgress: number; // out of 100
}

export interface PerformanceRatingTrend {
  month: string;
  rating: number; // out of 5
}

export interface PerformanceReview {
  reviewerName: string;
  role: 'Manager' | 'Mentor' | 'Self' | 'HR';
  score: number;
  comment: string;
  date: string;
}

export interface EmployeeProject {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'On Hold';
  score: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'onboarding' | 'promotion' | 'transfer' | 'document' | 'mentor' | 'review' | 'status' | 'training';
}

export interface Employee {
  id: string;
  userId: string;
  organizationId: string;
  designation: string;
  joinDate: string;
  status: 'Active' | 'Probation' | 'Training' | 'On Leave' | 'Suspended' | 'Notice Period' | 'Resigned' | 'Terminated' | 'Inactive';
  managerId?: string;
  mentorId?: string;
  
  // Extra detailed profile fields
  name: string;
  email: string;
  avatar: string;
  roleName: string;
  
  // Tab 1: Personal Info
  phone: string;
  dob: string;
  gender: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  location: string;
  experienceLevel: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Director';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Training';
  
  // Tab 2: Documents Center
  documents: EmployeeDocument[];
  
  // Tab 3: HR Operations
  salaryGrade: string;
  band: string;
  shift: string;
  attendance: EmployeeAttendance;
  leave: EmployeeLeave;
  
  // Tab 4: Mentor Management
  mentorMetrics?: MentorMetrics;
  
  // Tab 5: Access & Admin
  accessControl?: AccessControl;
  auditTrail?: AuditTrailEntry[];
  
  // Tab 6: Performance Center
  performanceMetrics?: PerformanceMetric;
  performanceTrend?: PerformanceRatingTrend[];
  performanceReviews?: PerformanceReview[];
  
  // Tab 7: Projects
  projects?: EmployeeProject[];
  
  // Tab 8: Timeline
  timeline: TimelineEvent[];
}