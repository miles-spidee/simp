import { apiClient } from './api.client';
import { OpeningCreate, OpeningResponse, OpeningMentorCreate, OpeningMentorResponse } from '../types/api/opportunity.types';

export const opportunityApi = {
  getOpenings: async (): Promise<OpeningResponse[]> => {
    const res = await apiClient.get<OpeningResponse[]>('/api/v1/opportunity/');
    return res.data;
  },
  createOpening: async (data: OpeningCreate): Promise<OpeningResponse> => {
    const res = await apiClient.post<OpeningResponse>('/api/v1/opportunity/', data);
    return res.data;
  },
  getOpening: async (id: string): Promise<OpeningResponse> => {
    const res = await apiClient.get<OpeningResponse>(`/api/v1/opportunity/${id}`);
    return res.data;
  },
  updateOpening: async (id: string, data: OpeningCreate): Promise<OpeningResponse> => {
    const res = await apiClient.put<OpeningResponse>(`/api/v1/opportunity/${id}`, data);
    return res.data;
  },
  deleteOpening: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/opportunity/${id}`);
  },
  getOpeningMentors: async (openingId: string): Promise<OpeningMentorResponse[]> => {
    const res = await apiClient.get<OpeningMentorResponse[]>(`/api/v1/opportunity/${openingId}/mentors`);
    return res.data;
  },
  assignMentor: async (openingId: string, data: OpeningMentorCreate): Promise<OpeningMentorResponse> => {
    const res = await apiClient.post<OpeningMentorResponse>(`/api/v1/opportunity/${openingId}/mentors`, data);
    return res.data;
  },
  removeMentor: async (openingId: string, employeeId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/opportunity/${openingId}/mentors/${employeeId}`);
  }
};
