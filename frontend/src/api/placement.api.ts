import { apiClient } from './api.client';
import { PlacementRecord, Company, PlacementOpportunity } from '../types/placement.types';

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
      const res = await apiClient.get('/api/v1/placement/companies');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  createCompany: async (company: Partial<Company>): Promise<Company> => {
    try {
      const res = await apiClient.post('/api/v1/placement', company);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  getOpportunities: async (studentId?: string): Promise<{ opportunities: PlacementOpportunity[]; performanceTier: string; performanceScore?: number }> => {
    try {
      const url = studentId ? `/api/v1/placement/opportunities?student_id=${studentId}` : '/api/v1/placement/opportunities';
      const res = await apiClient.get(url);
      return res.data?.data || { opportunities: [], performanceTier: 'ALL' };
    } catch (error) {
      return { opportunities: [], performanceTier: 'ALL' };
    }
  },

  createOpportunity: async (opp: Partial<PlacementOpportunity>): Promise<PlacementOpportunity> => {
    try {
      const res = await apiClient.post('/api/v1/placement/opportunities', opp);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  deleteOpportunity: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/v1/placement/opportunities/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }
};
