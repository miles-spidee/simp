import { apiClient } from './api.client';
import { PaymentTransaction } from '../types/payment.types';

export const paymentApi = {
  getPayments: async (): Promise<PaymentTransaction[]> => {
    const res = await apiClient.get<PaymentTransaction[]>('/payments');
    return res.data;
  },
  getPaymentById: async (id: string): Promise<PaymentTransaction> => {
    const res = await apiClient.get<PaymentTransaction>(`/payments/${id}`);
    return res.data;
  }
};

