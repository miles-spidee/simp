import { WalletTransaction } from '../types/wallet.types';
import { MOCK_WALLET_TRANSACTIONS } from '../data/mock-wallet';

export const walletApi = {
  getTransactions: async (): Promise<WalletTransaction[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_WALLET_TRANSACTIONS), 500));
  }
};
