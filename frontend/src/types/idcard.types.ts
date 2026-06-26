export type IDCardStatus = 'Active' | 'Expired' | 'Suspended';

export interface DigitalIDCard {
  id: string;
  cardNumber: string;
  studentId: string;
  studentName: string;
  department: string;
  program: string;
  batch: string;
  photoUrl: string;
  qrCodeData: string;
  issueDate: string;
  expiryDate: string;
  status: IDCardStatus;
  bloodGroup: string;
  emergencyContact: string;
}
