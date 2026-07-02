import { apiClient } from './api.client';
import { Certificate } from '../types/certificate.types';
import {} from '../types/certificates.types';


export const CertificateApi = {
  getCertificates: async (): Promise<Certificate[]> => {
    try {
      const res = await apiClient.get('/api/v1/certificate');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getCertificateById: async (id: string): Promise<Certificate | undefined> => {
    try {
      const res = await apiClient.get(`/api/v1/certificate/${id}`);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  createCertificate: async (cert: Partial<Certificate>): Promise<Certificate> => {
    try {
      const res = await apiClient.post('/api/v1/certificate', cert);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  updateCertificateStatus: async (id: string, status: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Revoked', approvedBy?: string): Promise<Certificate> => {
    try {
      const res = await apiClient.patch(`/api/v1/certificate/${id}`, { status, approvedBy });
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
