import { apiClient } from './api.client';
import { InternshipTypeCreate, InternshipTypeResponse, ProgramCreate, ProgramResponse } from '../types/api/program.types';

export const programApi = {
  getInternshipTypes: async (): Promise<InternshipTypeResponse[]> => {
    const res = await apiClient.get<InternshipTypeResponse[]>('/programs/internship-types');
    return res.data;
  },
  createInternshipType: async (data: InternshipTypeCreate): Promise<InternshipTypeResponse> => {
    const res = await apiClient.post<InternshipTypeResponse>('/programs/internship-types', data);
    return res.data;
  },
  getPrograms: async (): Promise<ProgramResponse[]> => {
    const res = await apiClient.get<ProgramResponse[]>('/programs');
    return res.data;
  },
  createProgram: async (data: ProgramCreate): Promise<ProgramResponse> => {
    const res = await apiClient.post<ProgramResponse>('/programs', data);
    return res.data;
  }
};
