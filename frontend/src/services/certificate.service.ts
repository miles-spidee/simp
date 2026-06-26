import { CertificateApi } from '../api/certificate.api';

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
  }
};
