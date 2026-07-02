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
  },
  updateEmployee: async (id: string, data: Partial<EmployeeCreate> & Record<string, any>): Promise<EmployeeResponse> => {
    const res = await apiClient.patch<EmployeeResponse>(`/api/v1/employee/${id}`, data);
    return (res.data as any)?.data || res.data;
  },
  bulkChangeStatus: async (ids: string[], status: string): Promise<void> => {
    await apiClient.post('/api/v1/employee/bulk/status', { ids, status });
  },
  bulkTransferDepartment: async (ids: string[], organizationId: string): Promise<void> => {
    await apiClient.post('/api/v1/employee/bulk/department', { ids, organizationId });
  },
  bulkAssignMentor: async (ids: string[], mentorId: string): Promise<void> => {
    await apiClient.post('/api/v1/employee/bulk/mentor', { ids, mentorId });
  }
};
