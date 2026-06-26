import { PlacementRecord, Company } from '../types/placement.types';
import { MOCK_PLACEMENTS, MOCK_COMPANIES } from '../data/mock-placement';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const PlacementApi = {
  getPlacements: async (): Promise<PlacementRecord[]> => {
    await delay(500);
    return MOCK_PLACEMENTS;
  },
  
  getCompanies: async (): Promise<Company[]> => {
    await delay(400);
    return MOCK_COMPANIES;
  }
};
