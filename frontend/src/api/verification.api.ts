import { VerificationRequest, VerificationResult } from '../types/verification.types';
import { MOCK_VERIFICATION_REQUESTS } from '../data/mock-verifications';
import { MOCK_CERTIFICATES } from '../data/mock-certificates';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const VerificationApi = {
  getRequests: async (): Promise<VerificationRequest[]> => {
    await delay(500);
    return MOCK_VERIFICATION_REQUESTS;
  },

  verifyCertificate: async (certNumber: string): Promise<VerificationResult> => {
    await delay(600);
    const cert = MOCK_CERTIFICATES.find(c => c.certificateNumber === certNumber);
    if (!cert) {
      return { status: 'Invalid', message: 'Certificate not found in records.' };
    }
    if (cert.status === 'Revoked') {
      return { status: 'Revoked', message: 'This certificate has been revoked.', studentName: cert.studentName };
    }
    return {
      status: 'Valid',
      message: 'Certificate is valid and verified.',
      studentName: cert.studentName,
      program: cert.program,
      batch: cert.batch,
      issueDate: cert.issueDate || undefined,
      organization: 'Pinesphere',
      certificateType: cert.type
    };
  }
};
