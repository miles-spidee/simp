export interface DegreeResponse {
  degree_id: string;
  degree_name: string;
  degree_code: string;
  duration_years: number;
  status: string;
}

export interface DegreeCreate {
  degree_name: string;
  degree_code: string;
  duration_years: number;
}
