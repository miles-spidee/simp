import { apiClient } from './api.client';
import { FeeStructure } from '../types/fee.types';
import {} from '../types/fees.types';

export const feeApi = {
  getFees: async (): Promise<FeeStructure[]> => {
    try {
      const res = await apiClient.get('/api/v1/fee');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getFeeById: async (id: string): Promise<FeeStructure> => {
    try {
      const res = await apiClient.get('/api/v1/fee');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  createFee: async (data: Partial<FeeStructure>): Promise<FeeStructure> => {
    try {
      const res = await apiClient.post('/api/v1/fee', data);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  updateFee: async (id: string, data: Partial<FeeStructure>): Promise<FeeStructure> => {
    try {
      const res = await apiClient.patch('/api/v1/fee');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  deleteFee: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/v1/fee/${id}`);
    } catch (error) {}
  }
};
