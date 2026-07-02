import { apiClient } from './api.client';
import { EscalationRule, EscalationLog } from '../types/escalation.types';
import {} from '../types/escalations.types';

export const escalationApi = {
  getRules: async (): Promise<EscalationRule[]> => {
    try {
      const res = await apiClient.get('/api/v1/escalation/rules');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getEscalations: async (): Promise<EscalationLog[]> => {
    try {
      const res = await apiClient.get('/api/v1/escalation/logs');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getEscalationById: async (id: string): Promise<EscalationLog | undefined> => {
    try {
      const res = await apiClient.get(`/api/v1/escalation/logs/${id}`);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  
  updateEscalationStatus: async (id: string, status: 'Pending' | 'Resolved' | 'Ignored'): Promise<void> => {
    try {
      const res = await apiClient.patch(`/api/v1/escalation/${id}`, { status });
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
