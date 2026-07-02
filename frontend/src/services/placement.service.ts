import { PlacementApi } from '../api/placement.api';
import { Company } from '../types/placement.types';

export const PlacementService = {
  getPlacements: async () => {
    return await PlacementApi.getPlacements();
  },
  
  getCompanies: async () => {
    return await PlacementApi.getCompanies();
  },
  
  getStudentsHiredCount: async () => {
    const pl = await PlacementApi.getPlacements();
    return pl.filter(p => p.stage === 'Joined' || p.offerStatus === 'Accepted').length;
  },
  
  getTopCompanies: async () => {
    const pl = await PlacementApi.getPlacements();
    const countMap: Record<string, number> = {};
    pl.forEach(p => {
      if (p.stage === 'Joined') {
        countMap[p.companyName] = (countMap[p.companyName] || 0) + 1;
      }
    });
    return Object.entries(countMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  },
  
  getUpcomingInterviews: async () => {
    const pl = await PlacementApi.getPlacements();
    return pl.filter(p => p.interviewDate).sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime()).slice(0, 5);
  },

  createCompany: async (company: Partial<Company>) => {
    return await PlacementApi.createCompany(company);
  },
  
  getOpportunities: async (studentId?: string) => {
    return await PlacementApi.getOpportunities(studentId);
  },

  createOpportunity: async (opp: any) => {
    return await PlacementApi.createOpportunity(opp);
  },

  deleteOpportunity: async (id: string) => {
    return await PlacementApi.deleteOpportunity(id);
  }
};
