export interface EmployeeCreate {
  user_id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  official_email: string;
  joining_date: string;
  designation: string;
}

export interface EmployeeResponse {
  employee_id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  official_email: string;
  designation: string;
  status: string;
}
