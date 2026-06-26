import { escalationApi } from '../api/escalation.api';
import { EscalationRule, EscalationLog } from '../types/escalation.types';

export const escalationService = {
  getEscalationStats: async () => {
    const escalations = await escalationApi.getEscalations();
    return {
      totalEscalations: escalations.length,
      pendingEscalations: escalations.filter(e => e.status === 'Pending').length,
      resolvedEscalations: escalations.filter(e => e.status === 'Resolved').length,
    };
  },

  getRules: async (): Promise<EscalationRule[]> => {
    return await escalationApi.getRules();
  },

  getEscalations: async (): Promise<EscalationLog[]> => {
    return await escalationApi.getEscalations();
  },

  resolveEscalation: async (id: string) => {
    return await escalationApi.updateEscalationStatus(id, 'Resolved');
  }
};
