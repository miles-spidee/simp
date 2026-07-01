export interface OrganizationDepartment {
  name: string;
  hod: string;
  studentsCount: number;
  facultyCount: number;
  internshipsCount: number;
  placementRate: number; // percentage
  status: 'Active' | 'Inactive';
}

export interface OrganizationCoordinator {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  studentsManaged: number;
  programsManaged: number;
  status: 'Active' | 'Inactive';
  kpis: {
    applicationsProcessed: number;
    attendanceApprovals: number;
    internshipCompletions: number;
    placementSuccess: number; // percentage
  };
}

export interface OrganizationStudent {
  id: string;
  name: string;
  department: string;
  year: number;
  program: string;
  status: 'Active' | 'Completed' | 'Placed' | 'Placement Ready';
  coordinatorName: string;
}

export interface OrganizationProgram {
  name: string;
  duration: string; // e.g. 6 Months
  enrolledCount: number;
  status: 'Active' | 'Completed' | 'Upcoming';
  coordinatorName: string;
  analytics: {
    completionRate: number; // percentage
    attendanceRate: number; // percentage
    placementRate: number; // percentage
    satisfactionScore: number; // out of 5
    performanceScore: number; // out of 100
  };
}

export interface PlacementCompanyStats {
  companyName: string;
  hiredCount: number;
  avgPackage: string; // e.g. 12 LPA
}

export interface PlacementAnalytics {
  placementPercentage: number;
  studentsPlaced: number;
  companiesParticipated: number;
  avgPackage: string;
  placementTrend: { year: string; rate: number }[];
  deptPlacementRate: { dept: string; rate: number }[];
  companyHiring: PlacementCompanyStats[];
  salaryDistribution: { range: string; count: number }[];
  yoyGrowth: { year: string; growth: number }[];
}

export interface OrganizationDocument {
  type: 'MoU' | 'Partnership Agreement' | 'Approval Letter' | 'College Brochure' | 'Accreditation Certificates';
  name: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  version: string;
  previewContent?: string;
}

export interface OrganizationTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'added' | 'mou' | 'coordinator' | 'dept' | 'student_import' | 'program' | 'placement' | 'renewal';
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: string; // e.g. Engineering, Arts, Science, etc.
  headcount: number; // compatible with existing (total students)
  managerId: string; // compatible with existing (lead coordinator)
  status: 'Active' | 'Inactive'; // compatible with existing
  
  logo: string;
  university: string;
  location: string;
  partnershipStatus: 'Active' | 'Inactive' | 'Pending Verification' | 'Pending' | 'Partnership Expired' | 'Blacklisted' | 'Suspended';
  partnershipSince: string;
  
  // Tab 1: Overview Metadata
  website: string;
  email: string;
  phone: string;
  address: string;
  affiliation: string;
  accreditation: string;
  establishmentYear: number;
  
  // Tab 2: Departments
  departments: OrganizationDepartment[];
  
  // Tab 3: Coordinators
  coordinators: OrganizationCoordinator[];
  
  // Tab 4: Student Relationships
  students: OrganizationStudent[];
  
  // Tab 5: Internship Programs
  programs: OrganizationProgram[];
  
  // Tab 6: Placement Analytics
  placementAnalytics: PlacementAnalytics;
  
  // Tab 7: Metadata & MoU Documents
  naacGrade: string;
  nbaStatus: 'Accredited' | 'Not Accredited' | 'Applied';
  autonomousStatus: 'Autonomous' | 'Affiliated';
  nationalRanking: number;
  documents: OrganizationDocument[];
  
  // Tab 8: Partnership Timeline
  timeline: OrganizationTimelineEvent[];
}

export const MOCK_ORGANIZATIONS: Organization[] = [];
