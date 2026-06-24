export interface OpeningCreate {
  program_id: string;
  role_name: string;
  role_description: string;
  project_title: string;
  duration_weeks: number;
  stipend_amount: number;
  fee_amount: number;
  total_openings: number;
  application_deadline: string;
  status: string;
}

export interface OpeningResponse {
  opening_id: string;
  program_id: string;
  role_name: string;
  role_description: string;
  project_title: string;
  duration_weeks: number;
  stipend_amount: number;
  fee_amount: number;
  total_openings: number;
  application_deadline: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OpeningMentorCreate {
  employee_id: string;
}

export interface OpeningMentorResponse {
  opening_mentor_id: string;
  opening_id: string;
  employee_id: string;
  assigned_at: string;
}
