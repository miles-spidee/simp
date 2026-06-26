import { VerificationRequest } from '../types/verification.types';

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = Array.from({ length: 500 }).map((_, i) => {
  const results: any[] = ['Valid', 'Valid', 'Valid', 'Invalid', 'Expired', 'Revoked'];
  const methods: any[] = ['Certificate Number', 'QR Code', 'Verification Token'];
  return {
    id: `verreq_${i + 1}`,
    certificateNumber: `PS-CERT-2026-${String(i + 1).padStart(5, '0')}`,
    requestedByIp: `192.168.1.${i % 255}`,
    requestTime: new Date(Date.now() - i * 1800000).toISOString(),
    method: methods[i % methods.length],
    result: results[i % results.length]
  };
});
