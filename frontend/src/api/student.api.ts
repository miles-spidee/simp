import { apiClient } from './api.client';
import { StudentCreate, StudentResponse, StudentUpdate } from '../types/api/student.types';

export const studentApi = {
  getStudents: async (): Promise<StudentResponse[]> => {
    const res = await apiClient.get<StudentResponse[]>('/api/v1/student');
    return (res.data as any)?.data || res.data;
  },
  createStudent: async (data: StudentCreate): Promise<StudentResponse> => {
    const res = await apiClient.post<StudentResponse>('/api/v1/student', data);
    return (res.data as any)?.data || res.data;
  },
  getStudent: async (id: string): Promise<StudentResponse> => {
    const res = await apiClient.get<StudentResponse>(`/api/v1/student/${id}`);
    return (res.data as any)?.data || res.data;
  },
  updateStudent: async (id: string, data: StudentUpdate): Promise<StudentResponse> => {
    const res = await apiClient.put<StudentResponse>(`/api/v1/student/${id}`, data);
    return (res.data as any)?.data || res.data;
  },
  deleteStudent: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/student/${id}`);
  }
};
