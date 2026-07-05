import { Certificate } from '../types/certificate.types';

const getStoredCerts = (): Certificate[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('cert_mock');
    if (stored) return JSON.parse(stored);
    return [];
  } catch {
    return [];
  }
};

export const CertificateApi = {
  getCertificates: async (): Promise<Certificate[]> => {
    return getStoredCerts();
  },
  
  getCertificateById: async (id: string): Promise<Certificate | undefined> => {
    return getStoredCerts().find(c => c.id === id);
  },

  createCertificate: async (cert: Partial<Certificate>): Promise<Certificate> => {
    if (typeof window === 'undefined') return null as any;
    const certs = getStoredCerts();
    
    const newCert: Certificate = {
      ...cert,
      id: Math.random().toString(36).substr(2, 9),
      issueDate: new Date().toISOString(),
      verifyCode: Math.random().toString(36).substr(2, 12).toUpperCase(),
    } as Certificate;
    
    certs.unshift(newCert);
    localStorage.setItem('cert_mock', JSON.stringify(certs));
    return newCert;
  },

  updateCertificateStatus: async (id: string, status: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Revoked', approvedBy?: string): Promise<Certificate> => {
    if (typeof window === 'undefined') return null as any;
    const certs = getStoredCerts();
    const index = certs.findIndex(c => c.id === id);
    if (index > -1) {
      certs[index].status = status;
      if (approvedBy) certs[index].approvedBy = approvedBy;
      localStorage.setItem('cert_mock', JSON.stringify(certs));
      return certs[index];
    }
    return null as any;
  }
};
