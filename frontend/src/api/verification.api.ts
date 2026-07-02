import { apiClient } from './api.client';
import { VerificationRequest, VerificationResult } from '../types/verification.types';
import {} from '../types/verifications.types';
import {} from '../types/certificates.types';


export const VerificationApi = {
  getRequests: async (): Promise<VerificationRequest[]> => {
    try {
      const res = await apiClient.get('/api/v1/verification');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  verifyCertificate: async (certNumber: string): Promise<VerificationResult> => {
    try {
      const res = await apiClient.get(`/api/v1/verification/verify/${certNumber}`);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
