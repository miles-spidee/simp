export type WalletTransactionType = 'Credit' | 'Debit';
export type WalletSource = 'Refund' | 'Incentive' | 'Scholarship' | 'Cashback' | 'Referral Reward' | 'Stipend' | 'Fee Payment';
export type WalletStatus = 'Completed' | 'Pending' | 'Failed';

export interface WalletTransaction {
  id: string;
  walletId: string;
  studentId: string;
  studentName: string;
  type: WalletTransactionType;
  amount: number;
  source: WalletSource;
  reference: string;
  status: WalletStatus;
  date: string;
}

export interface WalletSummary {
  walletId: string;
  studentId: string;
  studentName: string;
  balance: number;
  totalCredits: number;
  totalDebits: number;
}
