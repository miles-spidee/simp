export interface StudentCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  enrollment_number?: string;
  department?: string;
  degree?: string;
  year?: number;
  cgpa?: number;
  graduation_year?: number;
  program?: string;
  internship_type?: string;
  batch_name?: string;
  mentor_id?: string;
  joining_date?: string;
  dob?: string;
  gender?: string;
  address?: string;
  status?: string;
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
  enrollment_number?: string;
}

export interface StudentUpdate {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  batch_name?: string;
  status?: string;
  mentor_id?: string;
  dob?: string;
  gender?: string;
  address?: string;
  cgpa?: number;
  internship_type?: string;
  year?: number;
  graduation_year?: number;
  student_status?: string;
}
