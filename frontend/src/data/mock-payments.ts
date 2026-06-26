import { PaymentTransaction, PaymentMode, PaymentStatus } from '../types/payment.types';

const generateMockPayments = (count: number): PaymentTransaction[] => {
  const modes: PaymentMode[] = ['UPI', 'Razorpay', 'Cash', 'Card', 'Bank Transfer', 'NEFT', 'Wallet'];
  const statuses: PaymentStatus[] = ['Pending', 'Processing', 'Success', 'Failed', 'Refunded', 'Cancelled'];
  const programs = ['B.Tech CSE', 'M.Tech Data Science', 'MBA Finance', 'BBA', 'BCA'];

  return Array.from({ length: count }).map((_, i) => {
    const amount = Math.floor(Math.random() * 50000) + 10000;
    const gst = amount * 0.18;
    const discount = Math.random() > 0.8 ? amount * 0.1 : 0;
    const fine = Math.random() > 0.9 ? 500 : 0;
    const netAmount = amount + gst - discount + fine;
    
    return {
      id: `pay-${i + 1}`,
      transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
      invoiceNumber: `INV-2026-${1000 + i}`,
      studentId: `STU-${1000 + i}`,
      studentName: `Student ${i + 1}`,
      program: programs[i % programs.length],
      amount,
      gst,
      discount,
      fine,
      netAmount,
      paymentMethod: modes[i % modes.length],
      referenceNumber: `REF${Math.floor(Math.random() * 1000000000)}`,
      status: statuses[i % statuses.length],
      createdDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
      paidDate: Math.random() > 0.2 ? new Date(Date.now() - Math.floor(Math.random() * 2000000000)).toISOString() : undefined,
      verifiedBy: Math.random() > 0.5 ? 'Admin' : undefined,
    };
  });
};

export const MOCK_PAYMENTS: PaymentTransaction[] = generateMockPayments(500);
