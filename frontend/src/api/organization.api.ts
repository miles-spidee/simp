import { apiClient } from './api.client';
import { CollegeCreate, CollegeResponse, DepartmentCreate, DepartmentResponse, CoordinatorCreate, CoordinatorResponse } from '../types/api/organization.types';
import {} from '../types/organizations.types';

export const organizationApi = {
  getColleges: async (): Promise<CollegeResponse[]> => {
    const res = await apiClient.get<any>('/api/v1/organization/colleges');
    return res.data.data;
  },

  createCollege: async (data: CollegeCreate): Promise<CollegeResponse> => {
    const res = await apiClient.post<any>('/api/v1/organization/colleges', data);
    return res.data.data;
  },

  updateCollege: async (id: string, data: Partial<CollegeResponse>): Promise<CollegeResponse> => {
    const res = await apiClient.patch<any>(`/api/v1/organization/colleges/${id}`, data);
    return res.data.data;
  },

  getDepartments: async (): Promise<DepartmentResponse[]> => {
    const res = await apiClient.get<any>('/api/v1/organization/departments');
    return res.data.data;
  },

  createDepartment: async (data: DepartmentCreate): Promise<DepartmentResponse> => {
    const res = await apiClient.post<any>('/api/v1/organization/departments', data);
    return res.data.data;
  },
  
  getCoordinators: async (): Promise<CoordinatorResponse[]> => {
    const res = await apiClient.get<any>('/api/v1/organization/college-coordinators');
    return res.data.data;
  },
  
  createCoordinator: async (data: CoordinatorCreate): Promise<CoordinatorResponse> => {
    const res = await apiClient.post<any>('/api/v1/organization/college-coordinators', data);
    return res.data.data;
  },
  
  bulkUpdatePartnership: async (ids: string[], status: string): Promise<boolean> => {
    const res = await apiClient.post<any>('/api/v1/organization/bulk-partnership', { ids, status });
    return res.data.success;
  },

  bulkAssignCoordinator: async (ids: string[], coordinator_name: string): Promise<boolean> => {
    const res = await apiClient.post<any>('/api/v1/organization/bulk-coordinators', { ids, coordinator_name });
    return res.data.success;
  }
};
