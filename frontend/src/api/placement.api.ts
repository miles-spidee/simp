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
    return [...MOCK_COMPANIES];
  },

  createCompany: async (company: Partial<Company>): Promise<Company> => {
    await delay(300);
    const newCompany: Company = {
      id: `comp_${MOCK_COMPANIES.length + 1}`,
      name: company.name || 'New Company Solutions',
      industry: company.industry || 'IT Services',
      website: company.website || 'https://example.com',
      contactPerson: company.contactPerson || 'HR Manager',
      contactEmail: company.contactEmail || 'hr@example.com',
      activeRoles: company.activeRoles || 1
    };
    MOCK_COMPANIES.unshift(newCompany);
    return newCompany;
  }
};
