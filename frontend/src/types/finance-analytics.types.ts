export interface PaymentMethodDistribution {
  method: string;
  amount: number;
}

export interface TransactionStatusDistribution {
  status: string;
  count: number;
}

export interface FinanceAnalytics {
  totalRealizedRevenue: number;
  paymentMethodDistribution: PaymentMethodDistribution[];
  transactionSuccessRate: TransactionStatusDistribution[];
}
