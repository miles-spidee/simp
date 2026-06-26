export type InternshipType = 'Full Time' | 'Part Time';
export type InternshipLocationType = 'Hybrid' | 'Remote' | 'On-Site';
export type InternshipCompensation = 'Paid' | 'Free';

export interface MarketplaceOpportunity {
  id: string;
  title: string;
  companyName: string;
  department: string;
  location: string;
  locationType: InternshipLocationType;
  type: InternshipType;
  compensation: InternshipCompensation;
  stipend?: string;
  durationMonths: number;
  skills: string[];
  description: string;
  requirements: string[];
  postedDate: string;
  deadlineDate: string;
  isActive: boolean;
  applicantsCount: number;
}

export interface MarketplaceApplication {
  id: string;
  opportunityId: string;
  studentId: string;
  status: 'Pending' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected';
  appliedDate: string;
  matchScore: number;
}
