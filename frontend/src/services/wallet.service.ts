import { walletApi } from '../api/wallet.api';
import { WalletSummary } from '../types/wallet.types';

class WalletService {
  async getTransactions() {
    return await walletApi.getTransactions();
  }

  async getWalletSummary(studentId?: string): Promise<WalletSummary> {
    const txns = await this.getTransactions();
    const studentTxns = studentId ? txns.filter(t => t.studentId === studentId) : txns;
    
    const credits = studentTxns.filter(t => t.type === 'Credit' && t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
    const debits = studentTxns.filter(t => t.type === 'Debit' && t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);

    return {
      walletId: studentId ? `W-${studentId}` : 'ALL',
      studentId: studentId || 'ALL',
      studentName: studentId ? studentTxns[0]?.studentName : 'All Students',
      balance: credits - debits,
      totalCredits: credits,
      totalDebits: debits,
    };
  }
}

export const walletService = new WalletService();
