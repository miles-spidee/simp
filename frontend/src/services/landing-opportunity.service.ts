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

  async createOpportunity(opp: Omit<Opportunity, 'id'>): Promise<Opportunity> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOpp: Opportunity = {
          ...opp,
          id: `opp-l-${Math.random().toString(36).substring(2, 9)}`
        };
        MOCK_LANDING_OPPORTUNITIES.push(newOpp);
        resolve(newOpp);
      }, 500);
    });
  }
}

export const landingOpportunityService = new LandingOpportunityService();

