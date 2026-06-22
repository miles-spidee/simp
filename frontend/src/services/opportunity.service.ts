import { Opportunity, MOCK_OPPORTUNITIES } from '../data/mock-opportunities';
import { landingOpportunityService } from './landing-opportunity.service';

export const opportunityService = {
  async getOpportunities(): Promise<Opportunity[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_OPPORTUNITIES];
  },

  async getOpportunity(id: string): Promise<Opportunity | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_OPPORTUNITIES.find(opp => opp.id === id);
  },

  async createOpportunity(opp: Omit<Opportunity, 'id' | 'postedDate'>): Promise<Opportunity> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Math.random().toString(36).substring(2, 9)}`,
      postedDate: new Date().toISOString().split('T')[0]
    };
    MOCK_OPPORTUNITIES.push(newOpp);

    // Synchronize to landing opportunity list for public view
    await landingOpportunityService.createOpportunity({
      title: opp.title,
      type: opp.type || 'Tech',
      value: opp.value || 'High Demand',
      description: opp.description || '',
      duration: opp.duration || '6 Months',
      mode: opp.location,
      seats: `${opp.openings} Openings`,
      eligibility: opp.eligibility || 'Open to all majors',
      startDate: opp.startDate || `Starts ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      color: opp.color || 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400',
      internshipType: opp.internshipType,
      amount: opp.amount
    });

    return newOpp;
  }
};


