export type ApplicationStatus =
  | 'Pending'
  | 'Interview'
  | 'Accepted'
  | 'Rejected'
  | 'New'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Hold'
  | 'Documents Missing'
  | 'Payment Verification Pending'
  | 'DRAFT'
  | 'WITHDRAWN';

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  type: 'Resume' | 'ID Proof' | 'Certificate' | 'Portfolio';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  candidateName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  state: string;

  // Academic
  college: string;
  department: string;
  degree: string;
  currentYear: string;
  cgpa: number;
  graduationYear: string;

  // Professional
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  projectExperience: string;

  // Motivation & Document
  resumeUrl: string;
  resumeBase64?: string;
  whyInternship: string;

  // Internship Type
  internshipType: 'free' | 'paid' | 'stipend' | 'industrial' | 'corporate' | 'research';
  status: ApplicationStatus;
  appliedDate: string;
  assignedReviewer: string;

  // Internship Specific Information
  feeAccepted?: boolean;
  paymentMode?: string;
  transactionId?: string;
  paymentScreenshot?: string;
  paymentVerified?: 'Pending' | 'Verified' | 'Rejected';
  amountPaid?: number;

  relevantExperience?: string;

  preferredTechStack?: string;
  technicalExperience?: string;

  researchArea?: string;
  researchStatement?: string;
  publications?: string;
  publicationLinks?: string[];

  // Review Workspace
  reviewScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  academicScore?: number;
  cultureFitScore?: number;
  overallRecommendation?: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire' | 'Hold';
  reviewerNotes?: string;
  reviewerFeedback?: string;

  // AI Assistance Panel
  aiMatchPercentage?: number;
  aiStrengths?: string[];
  aiWeaknesses?: string[];
  aiMissingInfo?: string;
  aiRiskFlags?: string[];
  aiRecommendedLevel?: string;
  aiSuggestedQuestions?: string[];
  aiResumeSummary?: string;
  aiSentiment?: 'Positive' | 'Neutral' | 'Concern';
  aiCommitmentScore?: number;
  aiCommunicationScore?: number;
  aiExperienceSummary?: string;
  aiSkillMatchPercentage?: number;
  aiResearchFitScore?: number;
}