import { apiClient } from './api.client';
import { StudentCreate, StudentResponse, StudentUpdate } from '../types/api/student.types';

export const studentApi = {
  getStudents: async (): Promise<StudentResponse[]> => {
    const res = await apiClient.get<StudentResponse[]>('/students/');
    return res.data;
  },
  createStudent: async (data: StudentCreate): Promise<StudentResponse> => {
    const res = await apiClient.post<StudentResponse>('/students/', data);
    return res.data;
  },
  getStudent: async (id: string): Promise<StudentResponse> => {
    const res = await apiClient.get<StudentResponse>(`/students/${id}`);
    return res.data;
  },
  updateStudent: async (id: string, data: StudentUpdate): Promise<StudentResponse> => {
    const res = await apiClient.put<StudentResponse>(`/students/${id}`, data);
    return res.data;
  },
  deleteStudent: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  }
};
