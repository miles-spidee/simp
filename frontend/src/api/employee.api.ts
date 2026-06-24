import { apiClient } from './api.client';
import { EmployeeCreate, EmployeeResponse } from '../types/api/employee.types';

export const employeeApi = {
  getEmployees: async (): Promise<EmployeeResponse[]> => {
    const res = await apiClient.get<EmployeeResponse[]>('/employees');
    return res.data;
  },
  createEmployee: async (data: EmployeeCreate): Promise<EmployeeResponse> => {
    const res = await apiClient.post<EmployeeResponse>('/employees', data);
    return res.data;
  }
};
