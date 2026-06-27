import { CertificateApi } from '../api/certificate.api';
import { Certificate } from '../types/certificate.types';

export const CertificateService = {
  getCertificates: async () => {
    return await CertificateApi.getCertificates();
  },
  
  getPendingApprovals: async () => {
    const certs = await CertificateApi.getCertificates();
    return certs.filter(c => c.status === 'Pending Approval');
  },
  
  getIssuedCertificatesCount: async () => {
    const certs = await CertificateApi.getCertificates();
    return certs.filter(c => c.status === 'Issued').length;
  },

  createCertificate: async (cert: Partial<Certificate>) => {
    return await CertificateApi.createCertificate(cert);
  },

  updateCertificateStatus: async (id: string, status: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Revoked', approvedBy?: string) => {
    return await CertificateApi.updateCertificateStatus(id, status, approvedBy);
  }
};
