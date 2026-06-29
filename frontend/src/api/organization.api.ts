import { apiClient } from './api.client';
import { CollegeCreate, CollegeResponse, DepartmentCreate, DepartmentResponse, CoordinatorCreate, CoordinatorResponse } from '../types/api/organization.types';
import { MOCK_ORGANIZATIONS } from '../data/mock-organizations';

export const organizationApi = {
  getColleges: async (): Promise<CollegeResponse[]> => {
    try {
      const res = await apiClient.get<CollegeResponse[]>('/api/v1/colleges');
      if (res.data && res.data.length > 0) return res.data;
    } catch (e) {
      console.debug('Failed to fetch colleges from API, using mock data', e);
    }
    return MOCK_ORGANIZATIONS.map(org => ({
      college_id: org.id,
      college_code: org.code,
      college_name: org.name,
      college_email: org.email,
      college_phone: org.phone,
      website_url: org.website,
      address_line_1: org.address,
      address_line_2: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      accreditation: org.accreditation,
      status: org.status,
      created_at: org.partnershipSince,
      updated_at: org.partnershipSince
    }));
  },

  createCollege: async (data: CollegeCreate): Promise<CollegeResponse> => {
    const res = await apiClient.post<CollegeResponse>('/api/v1/colleges', data);
    return res.data;
  },

  getDepartments: async (): Promise<DepartmentResponse[]> => {
    try {
      const res = await apiClient.get<DepartmentResponse[]>('/api/v1/departments');
      if (res.data && res.data.length > 0) return res.data;
    } catch (e) {
      console.debug('Failed to fetch departments from API, using mock data', e);
    }
    const depts: DepartmentResponse[] = [];
    MOCK_ORGANIZATIONS.forEach(org => {
      org.departments.forEach((d, idx) => {
        depts.push({
          department_id: `${org.id}-dept-${idx}`,
          college_id: org.id,
          department_code: d.name.substring(0, 3).toUpperCase(),
          department_name: d.name,
          hod_name: d.hod,
          department_email: '',
          status: d.status,
          created_at: '',
          updated_at: ''
        });
      });
    });
    return depts;
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
