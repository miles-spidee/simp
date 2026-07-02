export type PlacementStage = 'Eligible' | 'Applied' | 'Shortlisted' | 'Technical Round' | 'HR Round' | 'Selected' | 'Offer Released' | 'Joined' | 'Rejected';

export interface Company {
  id: string;
  name: string;
  industry: string;
  logoUrl?: string;
  website: string;
  contactPerson: string;
  contactEmail: string;
  activeRoles: number;
}

export interface PlacementRecord {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  companyId: string;
  companyName: string;
  role: string;
  package: string; // e.g. "12 LPA"
  location: string;
  stage: PlacementStage;
  interviewDate?: string;
  offerStatus?: 'Pending' | 'Accepted' | 'Declined';
  joiningDate?: string;
  remarks: string;
  lastUpdated: string;
}

export interface PlacementOpportunity {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  packageLpa: number;
  location: string;
  tier: string;
  requirements: string;
  status: string;
}
