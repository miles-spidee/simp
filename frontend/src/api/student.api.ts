import { apiClient } from './api.client';
import { StudentCreate, StudentResponse, StudentUpdate, TndceCollege } from '../types/api/student.types';

const COLLEGE_API_URL = process.env.NEXT_PUBLIC_COLLEGE_API_URL || '/api/v1/student/colleges';

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
  },
  bulkGenerateCredentials: async (ids: string[]): Promise<any> => {
    const res = await apiClient.post(`/api/v1/student/bulk-credentials`, ids);
    return res.data;
  },
  getColleges: async (search?: string): Promise<TndceCollege[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await apiClient.get<TndceCollege[]>(`${COLLEGE_API_URL}${params}`);
    return (res.data as any)?.data || res.data;
  }
};

