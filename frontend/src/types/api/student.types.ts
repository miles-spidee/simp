export interface StudentCreate {
  application_id: string;
  program_id: string;
}

export interface StudentResponse {
  student_id: string;
  application_id: string;
  program_id: string;
  intern_id: string;
  student_status: string;
  joined_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface StudentUpdate {
  student_status: string;
}
