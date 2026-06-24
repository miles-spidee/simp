import { apiClient } from './api.client';
import { CollegeCreate, CollegeResponse, DepartmentCreate, DepartmentResponse, CoordinatorCreate, CoordinatorResponse } from '../types/api/organization.types';

export const organizationApi = {
  getColleges: async (): Promise<CollegeResponse[]> => {
    const res = await apiClient.get<CollegeResponse[]>('/api/v1/colleges');
    return res.data;
  },
  createCollege: async (data: CollegeCreate): Promise<CollegeResponse> => {
    const res = await apiClient.post<CollegeResponse>('/api/v1/colleges', data);
    return res.data;
  },
  getDepartments: async (): Promise<DepartmentResponse[]> => {
    const res = await apiClient.get<DepartmentResponse[]>('/api/v1/departments');
    return res.data;
  },
  createDepartment: async (data: DepartmentCreate): Promise<DepartmentResponse> => {
    const res = await apiClient.post<DepartmentResponse>('/api/v1/departments', data);
    return res.data;
  },
  getCoordinators: async (): Promise<CoordinatorResponse[]> => {
    const res = await apiClient.get<CoordinatorResponse[]>('/api/v1/college-coordinators');
    return res.data;
  },
  createCoordinator: async (data: CoordinatorCreate): Promise<CoordinatorResponse> => {
    const res = await apiClient.post<CoordinatorResponse>('/api/v1/college-coordinators', data);
    return res.data;
  }
};
