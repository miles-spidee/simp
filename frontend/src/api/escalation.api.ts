import { EscalationRule, EscalationLog } from '../types/escalation.types';
import { MOCK_ESCALATION_RULES, MOCK_ESCALATIONS } from '../data/mock-escalations';

export const escalationApi = {
  getRules: async (): Promise<EscalationRule[]> => {
    return Promise.resolve([...MOCK_ESCALATION_RULES]);
  },
  
  getEscalations: async (): Promise<EscalationLog[]> => {
    return Promise.resolve([...MOCK_ESCALATIONS]);
  },
  
  getEscalationById: async (id: string): Promise<EscalationLog | undefined> => {
    return Promise.resolve(MOCK_ESCALATIONS.find(e => e.id === id));
  },
  
  updateEscalationStatus: async (id: string, status: 'Pending' | 'Resolved' | 'Ignored'): Promise<void> => {
    const index = MOCK_ESCALATIONS.findIndex(e => e.id === id);
    if (index !== -1) {
      MOCK_ESCALATIONS[index].status = status;
    }
    return Promise.resolve();
  }
};
