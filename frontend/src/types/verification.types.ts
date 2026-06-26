export type VerificationStatus = 'Valid' | 'Invalid' | 'Expired' | 'Revoked';

export interface VerificationRequest {
  id: string;
  certificateNumber: string;
  requestedByIp: string;
  requestTime: string;
  method: 'Certificate Number' | 'QR Code' | 'Verification Token';
  result: VerificationStatus;
}

export interface VerificationResult {
  status: VerificationStatus;
  studentName?: string;
  program?: string;
  batch?: string;
  issueDate?: string;
  organization?: string;
  certificateType?: string;
  message: string;
  previewUrl?: string;
}
