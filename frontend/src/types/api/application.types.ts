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
}

export interface ApplicationReviewRequest {
  application_status: string;
  remarks: string;
}
