import { DigitalIDCard } from '../types/idcard.types';
import { MOCK_IDCARDS } from '../data/mock-idcards';

const DELAY = 500;

export const IDCardAPI = {
  getIDCards: async (): Promise<DigitalIDCard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_IDCARDS]), DELAY);
    });
  },

  getMyIDCard: async (studentId: string): Promise<DigitalIDCard | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const card = MOCK_IDCARDS.find(c => c.studentId === studentId);
        resolve(card || null);
      }, DELAY);
    });
  }
};
