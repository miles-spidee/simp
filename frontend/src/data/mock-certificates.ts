import { Certificate } from '../types/certificate.types';

export const MOCK_CERTIFICATES: Certificate[] = Array.from({ length: 1000 }).map((_, i) => {
  const types: any[] = ['Offer Letter', 'Joining Letter', 'Internship Letter', 'Completion Certificate', 'Recommendation Letter', 'Experience Certificate', 'Participation Certificate'];
  const statuses: any[] = ['Draft', 'Pending Approval', 'Approved', 'Issued', 'Revoked'];
  const status = statuses[i % statuses.length];
  
  return {
    id: `cert_${i + 1}`,
    certificateNumber: `PS-CERT-${2026}-${String(i + 1).padStart(5, '0')}`,
    studentId: `std_${(i % 100) + 1}`,
    studentName: `Student ${i + 1}`,
    program: i % 2 === 0 ? 'Full Stack Web Development' : 'Data Science & AI',
    batch: i % 2 === 0 ? 'FSD-2026-A' : 'DSAI-2026-B',
    mentorName: `Mentor ${(i % 10) + 1}`,
    type: types[i % types.length],
    issueDate: status === 'Issued' ? new Date(Date.now() - i * 86400000).toISOString() : null,
    expiryDate: null,
    status,
    generatedBy: 'System',
    approvedBy: status === 'Issued' || status === 'Approved' ? 'HR Manager' : undefined,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PS-CERT-${2026}-${String(i + 1).padStart(5, '0')}`,
    verificationUrl: `https://erp.pinesphere.com/verify?id=PS-CERT-${2026}-${String(i + 1).padStart(5, '0')}`,
    digitalSignatureId: status === 'Issued' ? `SIG-${Date.now()}-${i}` : undefined,
    createdTime: new Date(Date.now() - (i + 5) * 86400000).toISOString()
  };
});
