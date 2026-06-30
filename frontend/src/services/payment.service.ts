import { paymentApi } from '../api/payment.api';
import { PaymentTransaction } from '../types/payment.types';

class PaymentService {
  async getPayments(): Promise<PaymentTransaction[]> {
    return await paymentApi.getPayments();
  }
  
  async getPaymentById(id: string): Promise<PaymentTransaction> {
    return await paymentApi.getPaymentById(id);
  }
  
  async createPayment(data: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    return await paymentApi.createPayment(data);
  }
  
  async updatePayment(id: string, data: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    return await paymentApi.updatePayment(id, data);
  }
  
  async deletePayment(id: string): Promise<void> {
    return await paymentApi.deletePayment(id);
  }

  async getPaymentStatistics() {
    const payments = await this.getPayments();
    return {
      totalAmount: payments.reduce((sum, p) => sum + p.netAmount, 0),
      successCount: payments.filter(p => p.status === 'Success').length,
      pendingCount: payments.filter(p => p.status === 'Pending').length,
      refundedCount: payments.filter(p => p.status === 'Refunded').length,
    };
  }
}

export const paymentService = new PaymentService();
