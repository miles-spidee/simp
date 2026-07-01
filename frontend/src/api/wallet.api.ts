import { apiClient } from './api.client';
import { WalletTransaction, WalletSummary } from '../types/wallet.types';
import {} from '../types/wallet.types';

export const walletApi = {
  getTransactions: async (): Promise<WalletTransaction[]> => {
    try {
      const res = await apiClient.get('/api/v1/wallet');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getSummary: async (): Promise<WalletSummary> => {
    try {
      const res = await apiClient.get('/api/v1/wallet');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
