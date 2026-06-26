import { FinanceMetrics } from '../types/finance.types';
import { paymentService } from '../services/payment.service';
import { billingService } from '../services/billing.service';
import { walletService } from '../services/wallet.service';

export const financeApi = {
  getDashboardMetrics: async (): Promise<FinanceMetrics> => {
    // In a real app this would be a single optimized backend call.
    // For mock, we aggregate from services.
    const payStats = await paymentService.getPaymentStatistics();
    const billStats = await billingService.getBillingSummary();
    const walletStats = await walletService.getWalletSummary();

    return {
      todaysCollection: Math.floor(payStats.totalAmount * 0.05), // Mock daily percentage
      monthlyRevenue: payStats.totalAmount,
      pendingPayments: billStats.totalPending,
      totalTransactions: payStats.successCount + payStats.pendingCount + payStats.refundedCount,
      refundRequests: payStats.refundedCount,
      walletBalance: walletStats.balance,
      revenueGrowth: 12.5, // Mock growth percentage
    };
  }
};
