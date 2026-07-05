export interface ApplicationPersonalInformation {
  photo?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  state: string;
}

export interface ApplicationAcademicInformation {
  collegeName: string;
  department: string;
  degree: string;
  currentYear: string;
  cgpaPercentage: string;
  graduationYear: string;
}

export interface ApplicationProfessionalInformation {
  skills: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  projectExperience: string;
}

export interface ApplicationInternshipSpecificData {
  paymentMode?: string;
  transactionId?: string;
  relevantExperience?: string;
  preferredTechStack?: string;
  relevantTechnicalExperience?: string;
  researchAreaOfInterest?: string;
  researchInterestStatement?: string;
  publicationLinks?: string;
  paymentScreenshot?: string;
}

export interface ApplicationDocuments {
  resume?: string;
  passbook?: string;
}

export interface ApplicationMotivation {
  whyInternship: string;
}

export interface ApplicationCreate {
  opening_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  resume_url?: string;

  internshipType: string;
  personalInformation: ApplicationPersonalInformation;
  academicInformation: ApplicationAcademicInformation;
  professionalInformation: ApplicationProfessionalInformation;
  internshipSpecificData?: ApplicationInternshipSpecificData;
  documents?: ApplicationDocuments;
  motivation?: ApplicationMotivation;
}

export type ApplicationProfileResponse = any;

export interface ApplicationResponse {
  opening_id: string;
  application_id: string;
  applicant_user_id: string;
  application_status: string;
  applied_at: string;
  reviewed_at: string;
  reviewed_by: string;
  remarks: string;
  profile?: ApplicationProfileResponse;
  application_data?: any;
  review_data?: any;
}

export interface ApplicationReviewRequest {
  application_status: string;
  remarks: string;
  technical_score?: number;
  communication_score?: number;
  academic_score?: number;
  culture_fit_score?: number;
  overall_recommendation?: string;
  reviewer_notes?: string;
  reviewer_feedback?: string;
  amount_paid?: number;
  payment_verified?: string;
}
