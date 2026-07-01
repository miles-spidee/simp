export interface CurriculumModule {
  name: string;
  topics: string[];
  learningOutcomes: string[];
  assessments: string[];
  assignments: string[];
  projects: string[];
}

export interface ProgramEnrollment {
  id: string;
  name: string;
  college: string;
  department: string;
  enrollmentDate: string;
  attendance: number; // percentage
  performance: number; // score out of 100
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ProgramMentor {
  id: string;
  name: string;
  department: string;
  assignedStudents: number;
  sessionsConducted: number;
  rating: number; // out of 5
  successRate: number; // percentage
  satisfaction: number; // out of 5
  completionContribution: number; // percentage
}

export interface ProgramAnalytics {
  completionRate: number;
  attendanceRate: number;
  avgScore: number;
  placementRate: number;
  satisfactionScore: number;
  enrollmentTrend: { month: string; count: number }[];
  completionTrend: { year: string; rate: number }[];
  attendanceTrend: { week: string; rate: number }[];
  assessmentPerformance: { testName: string; avgScore: number }[];
}

export interface CertificationStats {
  generated: number;
  issued: number;
  pending: number;
  list: { id: string; studentName: string; issueDate: string; status: 'Issued' | 'Pending' | 'Revoked' }[];
}

export interface ProgramMetadata {
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  domain: string;
  tags: string[];
  techStack: string[];
  skills: string[];
  certType: string;
}

export interface ProgramTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'created' | 'curriculum' | 'enrollment' | 'mentor' | 'assessment' | 'cert' | 'close' | 'update';
}

export interface Program {
  id: string;
  title: string; // Course Name / Program Title (compatible with batch/page.tsx)
  code: string;
  durationWeeks: number;
  organizationId: string; // Associated college/org
  status: 'Draft' | 'Upcoming' | 'Open Enrollment' | 'Active' | 'Completed' | 'Archived' | 'Suspended';
  
  type: 'Free Internship' | 'Paid Internship' | 'Stipend Internship' | 'Industrial Training' | 'Research Program' | 'Corporate Sponsored' | 'Placement Prep';
  startDate: string;
  endDate: string;
  studentsEnrolled: number;
  mentorsAssigned: number;
  completionRate: number;
  
  // Tab 1: Overview
  description: string;
  capacity: number;
  eligibility: string;
  
  // Tab 2: Curriculum Modules
  curriculum: CurriculumModule[];
  
  // Tab 4: Enrollments
  enrollments: ProgramEnrollment[];
  
  // Tab 5: Mentors
  mentors: ProgramMentor[];
  
  // Tab 6: Performance Analytics
  analytics: ProgramAnalytics;
  
  // Tab 7: Certifications
  certifications: CertificationStats;
  
  // Tab 8: Metadata
  metadata: ProgramMetadata;
  
  // Tab 9: Timeline
  timeline: ProgramTimelineEvent[];
}

export const MOCK_PROGRAMS: Program[] = [];
