export interface BatchCreate {
  program_id: string;
  semester_id?: string;

  name?: string;
  code?: string;
  batch_name?: string;
  batch_code?: string;
  batch_status?: string;

  start_date: string;
  end_date: string;

  max_capacity: number;
}
export interface BatchResponse {
  batch_id: string;
  program_id: string;
  batch_code: string;
  batch_name: string;
  max_capacity: number;
  start_date: string;
  end_date: string;
  batch_status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BatchStudentCreate {
  student_id: string;
  assigned_by: string;
}

export interface BatchStudentResponse {
  batch_student_id: string;
  batch_id: string;
  student_id: string;
  assigned_at: string;
  assigned_by: string;
}
