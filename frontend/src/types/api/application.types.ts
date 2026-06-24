export interface ApplicationProfileCreate {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  date_of_birth: string;
  gender: string;
  city: string;
  state: string;
  college_name: string;
  department: string;
  degree: string;
  current_year: number;
  cgpa_percentage: number;
  graduation_year: number;
  skills: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  project_experience: string;
  motivation_statement: string;
}

export interface ApplicationCreate {
  opening_id: string;
  profile: ApplicationProfileCreate;
}

export type ApplicationProfileResponse = ApplicationProfileCreate;

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
