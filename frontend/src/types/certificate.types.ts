export type CertificateStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Revoked';
export type CertificateType = 'Offer Letter' | 'Joining Letter' | 'Internship Letter' | 'Completion Certificate' | 'Recommendation Letter' | 'Experience Certificate' | 'Participation Certificate';

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  program: string;
  batch: string;
  mentorName: string;
  type: CertificateType;
  issueDate: string | null;
  expiryDate: string | null;
  status: CertificateStatus;
  generatedBy: string;
  approvedBy?: string;
  qrCodeUrl: string;
  verificationUrl: string;
  digitalSignatureId?: string;
  createdTime: string;
}
