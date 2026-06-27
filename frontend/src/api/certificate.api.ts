import { Certificate } from '../types/certificate.types';
import { MOCK_CERTIFICATES } from '../data/mock-certificates';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const CertificateApi = {
  getCertificates: async (): Promise<Certificate[]> => {
    await delay(500);
    return [...MOCK_CERTIFICATES];
  },
  
  getCertificateById: async (id: string): Promise<Certificate | undefined> => {
    await delay(300);
    return MOCK_CERTIFICATES.find(c => c.id === id);
  },

  createCertificate: async (cert: Partial<Certificate>): Promise<Certificate> => {
    await delay(400);
    const newCert: Certificate = {
      id: `cert_${MOCK_CERTIFICATES.length + 1}`,
      certificateNumber: `PS-CERT-2026-${String(MOCK_CERTIFICATES.length + 1).padStart(5, '0')}`,
      studentId: cert.studentId || 'std_1',
      studentName: cert.studentName || 'New Student',
      program: cert.program || 'Full Stack Web Development',
      batch: cert.batch || 'FSD-2026-A',
      mentorName: cert.mentorName || 'Chief Mentor',
      type: cert.type || 'Completion Certificate',
      issueDate: cert.status === 'Issued' ? new Date().toISOString() : null,
      expiryDate: null,
      status: cert.status || 'Pending Approval',
      generatedBy: 'Admin Console',
      approvedBy: cert.status === 'Issued' ? 'HR Manager' : undefined,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PS-CERT-2026-${String(MOCK_CERTIFICATES.length + 1).padStart(5, '0')}`,
      verificationUrl: `https://erp.pinesphere.com/verify?id=PS-CERT-2026-${String(MOCK_CERTIFICATES.length + 1).padStart(5, '0')}`,
      digitalSignatureId: cert.status === 'Issued' ? `SIG-${Date.now()}-${MOCK_CERTIFICATES.length}` : undefined,
      createdTime: new Date().toISOString()
    };
    MOCK_CERTIFICATES.unshift(newCert);
    return newCert;
  },

  updateCertificateStatus: async (id: string, status: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Revoked', approvedBy?: string): Promise<Certificate> => {
    await delay(300);
    const cert = MOCK_CERTIFICATES.find(c => c.id === id);
    if (!cert) throw new Error('Certificate not found');
    cert.status = status;
    if (approvedBy) {
      cert.approvedBy = approvedBy;
    }
    if (status === 'Issued') {
      cert.issueDate = new Date().toISOString();
      cert.digitalSignatureId = `SIG-${Date.now()}-${cert.id}`;
    }
    return cert;
  }
};
