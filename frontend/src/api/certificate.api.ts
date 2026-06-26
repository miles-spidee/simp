import { Certificate } from '../types/certificate.types';
import { MOCK_CERTIFICATES } from '../data/mock-certificates';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const CertificateApi = {
  getCertificates: async (): Promise<Certificate[]> => {
    await delay(500);
    return MOCK_CERTIFICATES;
  },
  
  getCertificateById: async (id: string): Promise<Certificate | undefined> => {
    await delay(300);
    return MOCK_CERTIFICATES.find(c => c.id === id);
  }
};
