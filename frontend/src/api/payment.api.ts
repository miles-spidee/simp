import { PaymentTransaction } from '../types/payment.types';
import { MOCK_PAYMENTS } from '../data/mock-payments';

export const paymentApi = {
  getPayments: async (): Promise<PaymentTransaction[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PAYMENTS]), 600));
  },
  getPaymentById: async (id: string): Promise<PaymentTransaction> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const p = MOCK_PAYMENTS.find(x => x.id === id);
        if (p) resolve(p);
        else reject(new Error('Not found'));
      }, 600);
    });
  },
  createPayment: async (data: Partial<PaymentTransaction>): Promise<PaymentTransaction> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const p = { id: `PAY-${Date.now()}`, ...data } as PaymentTransaction;
        resolve(p);
      }, 600);
    });
  },
  updatePayment: async (id: string, data: Partial<PaymentTransaction>): Promise<PaymentTransaction> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const p = MOCK_PAYMENTS.find(x => x.id === id) || (data as PaymentTransaction);
        resolve({ ...p, ...data });
      }, 600);
    });
  },
  deletePayment: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 600));
  }
};
