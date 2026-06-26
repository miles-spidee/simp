export type PaymentStatus = 'Pending' | 'Processing' | 'Success' | 'Failed' | 'Refunded' | 'Cancelled';
export type PaymentMode = 'UPI' | 'Razorpay' | 'Cash' | 'Card' | 'Bank Transfer' | 'NEFT' | 'Wallet';

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  program: string;
  amount: number;
  gst: number;
  discount: number;
  fine: number;
  netAmount: number;
  paymentMethod: PaymentMode;
  referenceNumber: string;
  status: PaymentStatus;
  createdDate: string;
  paidDate?: string;
  verifiedBy?: string;
}
