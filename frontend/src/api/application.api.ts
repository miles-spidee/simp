import { apiClient } from './api.client';
import { ApplicationCreate, ApplicationResponse, ApplicationReviewRequest } from '../types/api/application.types';

export const applicationApi = {
  submitApplication: async (data: ApplicationCreate): Promise<ApplicationResponse> => {
    const res = await apiClient.post<ApplicationResponse>('/api/v1/application/', data);
    return res.data;
  },
  getApplication: async (id: string): Promise<ApplicationResponse> => {
    const res = await apiClient.get<ApplicationResponse>(`/api/v1/application/${id}`);
    return res.data;
  },
  getMyApplications: async (): Promise<ApplicationResponse[]> => {
    const res = await apiClient.get<ApplicationResponse[]>('/api/v1/application/me/list');
    return res.data;
  },
  getAllApplications: async (): Promise<ApplicationResponse[]> => {
    const res = await apiClient.get<ApplicationResponse[]>('/api/v1/application/admin/all');
    return res.data;
  },
  reviewApplication: async (id: string, data: ApplicationReviewRequest): Promise<ApplicationResponse> => {
    const res = await apiClient.patch<ApplicationResponse>(`/api/v1/application/${id}/review`, data);
    return res.data;
  },
  withdrawApplication: async (id: string): Promise<ApplicationResponse> => {
    const res = await apiClient.patch<ApplicationResponse>(`/api/v1/application/${id}/withdraw`);
    return res.data;
  }
};
