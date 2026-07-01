import { apiClient } from './api.client';
import { PlacementRecord, Company } from '../types/placement.types';
import {} from '../types/placement.types';


export const PlacementApi = {
  getPlacements: async (): Promise<PlacementRecord[]> => {
    try {
      const res = await apiClient.get('/api/v1/placement');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getCompanies: async (): Promise<Company[]> => {
    try {
      const res = await apiClient.get('/api/v1/placement');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  createCompany: async (company: Partial<Company>): Promise<Company> => {
    try {
      const res = await apiClient.post('/api/v1/placement');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
