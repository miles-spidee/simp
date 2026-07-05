import { apiClient } from './api.client';
import { PaymentTransaction } from '../types/payment.types';
import {} from '../types/payments.types';

export const paymentApi = {
  getPayments: async (): Promise<PaymentTransaction[]> => {
    try {
      const res = await apiClient.get('/api/v1/payment');
      return res.data?.data?.items || (Array.isArray(res.data?.data) ? res.data?.data : []);
    } catch (error) {
      return [];
    }
  },
  getPaymentById: async (id: string): Promise<PaymentTransaction> => {
    try {
      const res = await apiClient.get(`/api/v1/payment/${id}`);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  createPayment: async (data: Partial<PaymentTransaction>): Promise<PaymentTransaction> => {
    try {
      const res = await apiClient.post('/api/v1/payment', data);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  updatePayment: async (id: string, data: Partial<PaymentTransaction>): Promise<PaymentTransaction> => {
    try {
      const res = await apiClient.patch('/api/v1/payment');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  deletePayment: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/v1/payment/${id}`);
    } catch (error) {}
  }
};
