import { FinanceAnalytics } from '../types/finance-analytics.types';

export const MOCK_FINANCE_ANALYTICS: FinanceAnalytics = {
  totalRealizedRevenue: 3450000,
  paymentMethodDistribution: [
    { method: 'UPI', amount: 1800000 },
    { method: 'Credit Card', amount: 950000 },
    { method: 'Debit Card', amount: 450000 },
    { method: 'Net Banking', amount: 250000 }
  ],
  transactionSuccessRate: [
    { status: 'Success', count: 342 },
    { status: 'Pending', count: 45 },
    { status: 'Failed', count: 12 }
  ]
};
