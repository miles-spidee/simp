import { MarketplaceOpportunity, MarketplaceApplication } from '../types/marketplace.types';
import { MOCK_MARKETPLACE, MOCK_MARKETPLACE_APPLICATIONS } from '../data/mock-marketplace';

const DELAY = 500;

export const MarketplaceAPI = {
  getOpportunities: async (): Promise<MarketplaceOpportunity[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_MARKETPLACE]), DELAY);
    });
  },
  
  getApplications: async (): Promise<MarketplaceApplication[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_MARKETPLACE_APPLICATIONS]), DELAY);
    });
  }
};
