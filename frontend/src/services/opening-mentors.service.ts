import { OpeningMentor, MOCK_OPENING_MENTORS } from '../data/mock-opening-mentors';

class OpeningMentorsService {
  async getMentorsForOpportunity(opportunityId: string): Promise<OpeningMentor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_OPENING_MENTORS.filter(om => om.opportunityId === opportunityId));
      }, 300);
    });
  }

  async assignMentor(data: Omit<OpeningMentor, 'id' | 'assignedDate'>): Promise<OpeningMentor> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOm: OpeningMentor = {
          ...data,
          id: `om-${Math.random().toString(36).substring(2, 9)}`,
          assignedDate: new Date().toISOString().split('T')[0]
        };
        MOCK_OPENING_MENTORS.push(newOm);
        resolve(newOm);
      }, 500);
    });
  }
}

export const openingMentorsService = new OpeningMentorsService();
