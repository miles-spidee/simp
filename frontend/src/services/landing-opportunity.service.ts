import { Opportunity, MOCK_LANDING_OPPORTUNITIES } from '../data/mock-landing-opportunities';

class LandingOpportunityService {
  async getOpportunities(): Promise<Opportunity[]> {
    return new Promise((resolve) => {
      // Simulate network delay for realistic loading state
      setTimeout(() => {
        resolve([...MOCK_LANDING_OPPORTUNITIES]);
      }, 500);
    });
  }

  async getOpportunity(id: string): Promise<Opportunity | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_LANDING_OPPORTUNITIES.find(opp => opp.id === id));
      }, 300);
    });
  }
}

export const landingOpportunityService = new LandingOpportunityService();
