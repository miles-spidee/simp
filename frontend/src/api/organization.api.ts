import { apiClient } from './api.client';
import { apiCache } from '../lib/apiCache';
import { CollegeCreate, CollegeResponse, DepartmentCreate, DepartmentResponse, CoordinatorCreate, CoordinatorResponse } from '../types/api/organization.types';
import {} from '../types/organizations.types';

// Cache TTLs
const COLLEGES_TTL    = 300_000; // 5 min — colleges are stable reference data
const DEPARTMENTS_TTL = 300_000; // 5 min — departments rarely change
const COORDINATORS_TTL = 60_000; // 1 min — coordinators change more often

export const organizationApi = {
  getColleges: async (): Promise<CollegeResponse[]> => {
    return apiCache.fetch('org:colleges', async () => {
      const res = await apiClient.get<any>('/api/v1/organization/colleges');
      return res.data.data;
    }, COLLEGES_TTL);
  },

  createCollege: async (data: CollegeCreate): Promise<CollegeResponse> => {
    const res = await apiClient.post<any>('/api/v1/organization/colleges', data);
    apiCache.invalidate('org:colleges'); // bust on mutation
    return res.data.data;
  },

  updateCollege: async (id: string, data: Partial<CollegeResponse>): Promise<CollegeResponse> => {
    const res = await apiClient.patch<any>(`/api/v1/organization/colleges/${id}`, data);
    apiCache.invalidate('org:colleges');
    return res.data.data;
  },

  getDepartments: async (): Promise<DepartmentResponse[]> => {
    return apiCache.fetch('org:departments', async () => {
      const res = await apiClient.get<any>('/api/v1/organization/departments');
      return res.data.data;
    }, DEPARTMENTS_TTL);
  },

  createDepartment: async (data: DepartmentCreate): Promise<DepartmentResponse> => {
    const res = await apiClient.post<any>('/api/v1/organization/departments', data);
    apiCache.invalidate('org:departments');
    return res.data.data;
  },

  getCoordinators: async (): Promise<CoordinatorResponse[]> => {
    return apiCache.fetch('org:coordinators', async () => {
      const res = await apiClient.get<any>('/api/v1/organization/college-coordinators');
      return res.data.data;
    }, COORDINATORS_TTL);
  },

  createCoordinator: async (data: CoordinatorCreate): Promise<CoordinatorResponse> => {
    const res = await apiClient.post<any>('/api/v1/organization/college-coordinators', data);
    apiCache.invalidate('org:coordinators');
    return res.data.data;
  },

  bulkUpdatePartnership: async (ids: string[], status: string): Promise<boolean> => {
    const res = await apiClient.post<any>('/api/v1/organization/bulk-partnership', { ids, status });
    apiCache.invalidate('org:colleges');
    return res.data.success;
  },

  bulkAssignCoordinator: async (ids: string[], coordinator_name: string): Promise<boolean> => {
    const res = await apiClient.post<any>('/api/v1/organization/bulk-coordinators', { ids, coordinator_name });
    apiCache.invalidate('org:coordinators');
    return res.data.success;
  }
};
