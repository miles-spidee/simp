import { apiClient } from './api.client';
import { MarketplaceOpportunity, MarketplaceApplication } from '../types/marketplace.types';
import {} from '../types/marketplace.types';

const DELAY = 500;

export const MarketplaceAPI = {
  getOpportunities: async (): Promise<MarketplaceOpportunity[]> => {
    try {
      const res = await apiClient.get('/api/v1/marketplace');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getApplications: async (): Promise<MarketplaceApplication[]> => {
    try {
      const res = await apiClient.get('/api/v1/marketplace');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
