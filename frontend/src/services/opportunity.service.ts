import { Opportunity, MOCK_OPPORTUNITIES } from '../data/mock-opportunities';

export const opportunityService = {
  async getOpportunities(): Promise<Opportunity[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_OPPORTUNITIES;
  },

  async getOpportunity(id: string): Promise<Opportunity | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_OPPORTUNITIES.find(opp => opp.id === id);
  }
};
