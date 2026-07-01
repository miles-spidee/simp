import { apiClient } from './api.client';
import { EmployeeCreate, EmployeeResponse } from '../types/api/employee.types';

export const employeeApi = {
  getEmployees: async (): Promise<EmployeeResponse[]> => {
    const res = await apiClient.get<EmployeeResponse[]>('/api/v1/employee');
    return (res.data as any)?.data || res.data;
  },
  createEmployee: async (data: EmployeeCreate): Promise<EmployeeResponse> => {
    const res = await apiClient.post<EmployeeResponse>('/api/v1/employee', data);
    return (res.data as any)?.data || res.data;
  }
};
