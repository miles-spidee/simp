import { paymentApi } from '../api/payment.api';
import { PaymentTransaction } from '../types/payment.types';
import { MOCK_PAYMENTS } from '../data/mock-payments';

class PaymentService {
  async getPayments(): Promise<PaymentTransaction[]> {
    try {
      const data = await paymentApi.getPayments();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(e);
    }
    return MOCK_PAYMENTS;
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
