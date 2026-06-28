import { apiClient } from './api.client';
import { DegreeResponse, DegreeCreate } from '../types/api/degree.types';

export const degreeApi = {
  getDegrees: async (): Promise<DegreeResponse[]> => {
    const res = await apiClient.get<DegreeResponse[]>('/api/v1/degrees');
    return res.data;
  },
  createDegree: async (data: DegreeCreate): Promise<DegreeResponse> => {
    const res = await apiClient.post<DegreeResponse>('/api/v1/degrees', data);
    return res.data;
  }
};
