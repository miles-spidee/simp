import { apiClient } from './api.client';
import { OpeningCreate, OpeningResponse, OpeningMentorCreate, OpeningMentorResponse } from '../types/api/opportunity.types';

export const opportunityApi = {
  getOpenings: async (): Promise<OpeningResponse[]> => {
    const res = await apiClient.get<OpeningResponse[]>('/openings');
    return res.data;
  },
  createOpening: async (data: OpeningCreate): Promise<OpeningResponse> => {
    const res = await apiClient.post<OpeningResponse>('/openings', data);
    return res.data;
  },
  getOpening: async (id: string): Promise<OpeningResponse> => {
    const res = await apiClient.get<OpeningResponse>(`/openings/${id}`);
    return res.data;
  },
  updateOpening: async (id: string, data: OpeningCreate): Promise<OpeningResponse> => {
    const res = await apiClient.put<OpeningResponse>(`/openings/${id}`, data);
    return res.data;
  },
  deleteOpening: async (id: string): Promise<void> => {
    await apiClient.delete(`/openings/${id}`);
  },
  getOpeningMentors: async (openingId: string): Promise<OpeningMentorResponse[]> => {
    const res = await apiClient.get<OpeningMentorResponse[]>(`/openings/${openingId}/mentors`);
    return res.data;
  },
  assignMentor: async (openingId: string, data: OpeningMentorCreate): Promise<OpeningMentorResponse> => {
    const res = await apiClient.post<OpeningMentorResponse>(`/openings/${openingId}/mentors`, data);
    return res.data;
  },
  removeMentor: async (openingId: string, employeeId: string): Promise<void> => {
    await apiClient.delete(`/openings/${openingId}/mentors/${employeeId}`);
  }
};
