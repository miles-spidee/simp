import { apiClient } from './api.client';
import { ApplicationCreate, ApplicationResponse, ApplicationReviewRequest } from '../types/api/application.types';

export const applicationApi = {
  submitApplication: async (data: ApplicationCreate): Promise<ApplicationResponse> => {
    const res = await apiClient.post<any>('/api/v1/application/', data);
    return res.data.data;
  },
  getApplication: async (id: string): Promise<ApplicationResponse> => {
    const res = await apiClient.get<any>(`/api/v1/application/${id}`);
    return res.data.data;
  },
  getMyApplications: async (): Promise<ApplicationResponse[]> => {
    const res = await apiClient.get<any>('/api/v1/application/me/list');
    return res.data.data;
  },
  // getAllApplications: async (): Promise<ApplicationResponse[]> => {
  //   const res = await apiClient.get<ApplicationResponse[]>('/api/v1/application/admin/all');
  //   return res.data;
  // },
  getAllApplications: async (): Promise<ApplicationResponse[]> => {
  const res = await apiClient.get('/api/v1/application/admin/all');

  return res.data.data;
},
  reviewApplication: async (id: string, data: ApplicationReviewRequest): Promise<ApplicationResponse> => {
    const res = await apiClient.patch<any>(`/api/v1/application/${id}/review`, data);
    return res.data.data;
  },
  withdrawApplication: async (id: string): Promise<ApplicationResponse> => {
    const res = await apiClient.patch<any>(`/api/v1/application/${id}/withdraw`);
    return res.data.data;
  }
};
