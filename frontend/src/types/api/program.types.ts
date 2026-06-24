export interface InternshipTypeCreate {
  type_code: string;
  type_name: string;
  description: string;
}

export interface InternshipTypeResponse {
  internship_type_id: string;
  type_code: string;
  type_name: string;
  description: string;
  is_active: boolean;
}

export interface ProgramCreate {
  internship_type_id: string;
  program_code: string;
  program_name: string;
  program_description: string;
  duration_weeks: number;
  certificate_available: boolean;
  status: string;
}

export interface ProgramResponse {
  program_id: string;
  internship_type_id: string;
  program_code: string;
  program_name: string;
  program_description: string;
  duration_weeks: number;
  certificate_available: boolean;
  status: string;
}
