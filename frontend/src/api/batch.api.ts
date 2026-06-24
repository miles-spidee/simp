import { apiClient } from './api.client';
import { BatchCreate, BatchResponse, BatchStudentCreate, BatchStudentResponse } from '../types/api/batch.types';

export const batchApi = {
  getBatches: async (): Promise<BatchResponse[]> => {
    const res = await apiClient.get<BatchResponse[]>('/api/v1/batches');
    return res.data;
  },
  createBatch: async (data: BatchCreate): Promise<BatchResponse> => {
    const res = await apiClient.post<BatchResponse>('/api/v1/batches', data);
    return res.data;
  },
  getBatch: async (id: string): Promise<BatchResponse> => {
    const res = await apiClient.get<BatchResponse>(`/api/v1/batches/${id}`);
    return res.data;
  },
  updateBatch: async (id: string, data: BatchCreate): Promise<BatchResponse> => {
    const res = await apiClient.put<BatchResponse>(`/api/v1/batches/${id}`, data);
    return res.data;
  },
  deleteBatch: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/batches/${id}`);
  },
  getBatchStudents: async (): Promise<BatchStudentResponse[]> => {
    const res = await apiClient.get<BatchStudentResponse[]>('/api/v1/batch-students');
    return res.data;
  },
  assignStudent: async (data: BatchStudentCreate): Promise<BatchStudentResponse> => {
    const res = await apiClient.post<BatchStudentResponse>('/api/v1/batch-students', data);
    return res.data;
  },
  removeStudent: async (batchStudentId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/batch-students/${batchStudentId}`);
  }
};
