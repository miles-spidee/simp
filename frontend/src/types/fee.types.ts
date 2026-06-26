export type FeeType = 'Registration' | 'Internship' | 'Training' | 'Exam' | 'Certificate' | 'Hostel' | 'Transport';
export type FeeStatus = 'Active' | 'Inactive';

export interface FeeStructure {
  id: string;
  feeName: string;
  feeType: FeeType;
  amount: number;
  program: string;
  department: string;
  duration: string;
  applicableBatch: string;
  installments: number;
  lateFee: number;
  status: FeeStatus;
}
