import { apiClient } from './api.client';
import { InternshipTypeCreate, InternshipTypeResponse, ProgramCreate, ProgramResponse } from '../types/api/program.types';

export const programApi = {
  getInternshipTypes: async (): Promise<InternshipTypeResponse[]> => {
    const res = await apiClient.get<InternshipTypeResponse[]>('/api/v1/program/internship-types');
    return res.data;
  },
  createInternshipType: async (data: InternshipTypeCreate): Promise<InternshipTypeResponse> => {
    const res = await apiClient.post<InternshipTypeResponse>('/api/v1/program/internship-types', data);
    return res.data;
  },
  getPrograms: async (): Promise<ProgramResponse[]> => {
    const res = await apiClient.get<ProgramResponse[]>('/api/v1/program');
    return res.data;
  },
  createProgram: async (data: ProgramCreate): Promise<ProgramResponse> => {
    const res = await apiClient.post<ProgramResponse>('/api/v1/program', data);
    return res.data;
  }
};
