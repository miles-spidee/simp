export interface CollegeCreate {
  college_code: string;
  college_name: string;
  college_email: string;
  college_phone: string;
  website_url: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  accreditation: string;
  status: string;
}

export interface CollegeResponse {
  college_id: string;
  college_code: string;
  college_name: string;
  college_email: string;
  college_phone: string;
  website_url: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  accreditation: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentCreate {
  college_id: string;
  department_code: string;
  department_name: string;
  hod_name: string;
  department_email: string;
  status: string;
}

export interface DepartmentResponse {
  department_id: string;
  college_id: string;
  department_code: string;
  department_name: string;
  hod_name: string;
  department_email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CoordinatorCreate {
  employee_id: string;
  college_id: string;
  assigned_from: string;
  assigned_to?: string;
}

export interface CoordinatorResponse {
  coordinator_mapping_id: string;
  employee_id: string;
  college_id: string;
  assigned_from: string;
  assigned_to?: string;
  is_active: boolean;
  created_at: string;
}
