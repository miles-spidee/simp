export interface CareerProgress {
  id: string;
  companyName: string;
  designation: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location: string;
}

export interface AlumniProfile {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  batch: string;
  graduationYear: number;
  currentCompany: string;
  currentDesignation: string;
  linkedInUrl: string;
  careerHistory: CareerProgress[];
  achievements: string[];
  isMentoring: boolean;
  referralsProvided: number;
  lastUpdated: string;
}
