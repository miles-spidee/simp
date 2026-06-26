import { PaymentTransaction } from '../types/payment.types';
import { MOCK_PAYMENTS } from '../data/mock-payments';

export const paymentApi = {
  getPayments: async (): Promise<PaymentTransaction[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PAYMENTS), 600));
  },
  getPaymentById: async (id: string): Promise<PaymentTransaction | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PAYMENTS.find(p => p.id === id)), 400));
  }
};
