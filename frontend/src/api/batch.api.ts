import { apiClient } from './api.client';
import { BatchCreate, BatchResponse, BatchStudentCreate, BatchStudentResponse } from '../types/api/batch.types';

export const batchApi = {
  getBatches: async (): Promise<BatchResponse[]> => {
    const res = await apiClient.get<any>('/api/v1/batch');
    return res.data?.data || [];
  },
  createBatch: async (data: BatchCreate): Promise<BatchResponse> => {
    const res = await apiClient.post<any>('/api/v1/batch', data);
    return res.data?.data || res.data;
  },
  getBatch: async (id: string): Promise<BatchResponse> => {
    const res = await apiClient.get<any>(`/api/v1/batch/${id}`);
    return res.data?.data || res.data;
  },
  updateBatch: async (id: string, data: BatchCreate): Promise<BatchResponse> => {
    const res = await apiClient.put<BatchResponse>(`/api/v1/batch/${id}`, data);
    return res.data;
  },
  deleteBatch: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/batch/${id}`);
  },
  getBatchStudents: async (): Promise<BatchStudentResponse[]> => {
    const res = await apiClient.get<any>('/api/v1/batch-students');
    return res.data?.data || [];
  },
  assignStudent: async (data: BatchStudentCreate): Promise<BatchStudentResponse> => {
    const res = await apiClient.post<any>('/api/v1/batch-students', data);
    return res.data?.data || res.data;
  },
  removeStudent: async (batchStudentId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/batch-students/${batchStudentId}`);
  }
};
