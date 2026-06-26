import { paymentApi } from '../api/payment.api';
import { PaymentTransaction } from '../types/payment.types';

class PaymentService {
  async getPayments(): Promise<PaymentTransaction[]> {
    return await paymentApi.getPayments();
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
