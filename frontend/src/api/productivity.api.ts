import { apiClient } from './api.client';
import { ProductivityWorkspace } from '../types/productivity.types';
import {} from '../types/productivity.types';

const DELAY = 500;

export const ProductivityAPI = {
  getWorkspace: async (): Promise<ProductivityWorkspace> => {
    try {
      const res = await apiClient.get('/api/v1/productivity');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
