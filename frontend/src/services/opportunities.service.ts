import { opportunityApi } from '../api/opportunity.api';
import { OpeningCreate, OpeningResponse } from '../types/api/opportunity.types';
import { Opportunity, MOCK_OPPORTUNITIES } from '../data/mock-opportunities';

export type ExtendedOpening = OpeningResponse & Opportunity;

class OpportunitiesService {
  mapToExtended(opp: OpeningResponse): ExtendedOpening {
    return {
      ...opp,
      id: opp.opening_id,
      title: opp.project_title || opp.role_name,
      type: 'Internship',
      value: 'stipend',
      description: opp.role_description,
      duration: '6 Months',
      mode: 'Remote',
      seats: '10',
      eligibility: 'Any Degree',
      startDate: opp.created_at || new Date().toISOString(),
      color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400',
      internshipType: 'stipend',
      amount: '$0',
      programId: opp.program_id,
      status: 'Open' as any,
      postedDate: opp.created_at?.split('T')[0] || ''
    } as any;
  }

  async getOpportunities(): Promise<ExtendedOpening[]> {
    try {
      // Commented out backend call to use mock data for the landing page
      // const data = await opportunityApi.getOpenings();
      // return data.map(opp => this.mapToExtended(opp));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_OPPORTUNITIES as any;
    } catch (e) {
      console.debug(e);
      return [];
    }
  }

  async getOpportunity(id: string): Promise<ExtendedOpening | undefined> {
    try {
      // const opp = await opportunityApi.getOpening(id);
      // return this.mapToExtended(opp);
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_OPPORTUNITIES.find(o => o.id === id) as any;
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  }

  async createOpportunity(opp: OpeningCreate): Promise<ExtendedOpening> {
    // const res = await opportunityApi.createOpening(opp);
    // return this.mapToExtended(res);
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_OPPORTUNITIES[0] as any;
  }
}

export const opportunitiesService = new OpportunitiesService();
