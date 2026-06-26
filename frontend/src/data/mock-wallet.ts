import { WalletTransaction, WalletTransactionType, WalletSource, WalletStatus } from '../types/wallet.types';

export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = Array.from({ length: 100 }).map((_, i) => {
  const types: WalletTransactionType[] = ['Credit', 'Debit'];
  const sources: WalletSource[] = ['Refund', 'Incentive', 'Scholarship', 'Cashback', 'Referral Reward', 'Stipend', 'Fee Payment'];
  const statuses: WalletStatus[] = ['Completed', 'Pending', 'Failed'];
  
  return {
    id: `wt-${i + 1}`,
    walletId: `W-${1000 + (i % 20)}`,
    studentId: `STU-${1000 + (i % 20)}`,
    studentName: `Student ${(i % 20) + 1}`,
    type: types[i % types.length],
    amount: Math.floor(Math.random() * 5000) + 500,
    source: sources[i % sources.length],
    reference: `REF${Math.floor(Math.random() * 1000000000)}`,
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
  };
});
