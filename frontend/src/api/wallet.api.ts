import { WalletTransaction, WalletSummary } from '../types/wallet.types';
import { MOCK_WALLET_TRANSACTIONS, MOCK_WALLET_SUMMARY } from '../data/mock-wallet';

export const walletApi = {
  getTransactions: async (): Promise<WalletTransaction[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_WALLET_TRANSACTIONS]), 600));
  },
  getSummary: async (): Promise<WalletSummary> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_WALLET_SUMMARY), 600));
  }
};
