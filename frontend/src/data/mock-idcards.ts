import { DigitalIDCard } from '../types/idcard.types';

export const MOCK_IDCARDS: DigitalIDCard[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `IDC-${1000 + i}`,
  cardNumber: `ID-2026-${1000 + i}`,
  studentId: `STU-${100 + i}`,
  studentName: `Student ${i}`,
  department: 'Engineering',
  program: 'B.Tech Computer Science',
  batch: 'Class of 2026',
  photoUrl: `https://i.pravatar.cc/150?u=student${i}`,
  qrCodeData: `https://pinesphere.com/verify/ID-2026-${1000 + i}`,
  issueDate: new Date(Date.now() - 15552000000).toISOString(),
  expiryDate: new Date(Date.now() + 31536000000).toISOString(),
  status: i % 10 === 9 ? 'Expired' : 'Active',
  bloodGroup: ['O+', 'A+', 'B+', 'AB+'][i % 4],
  emergencyContact: '+1 (555) 019-283' + i
}));
