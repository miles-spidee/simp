import { Receipt } from '../types/billing.types';
import { MOCK_INVOICES } from './mock-invoices';

export const MOCK_RECEIPTS: Receipt[] = MOCK_INVOICES.filter(i => i.paymentStatus === 'Paid').map((inv, i) => {
  return {
    id: `rec-${i + 1}`,
    receiptNumber: `REC-2026-${1000 + i}`,
    invoiceNumber: inv.invoiceNumber,
    customerName: inv.customerName,
    amountPaid: inv.grandTotal,
    paymentMethod: ['UPI', 'Card', 'Bank Transfer'][i % 3],
    paymentDate: new Date(new Date(inv.issueDate).getTime() + Math.floor(Math.random() * 864000000)).toISOString(),
    transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
  };
});
