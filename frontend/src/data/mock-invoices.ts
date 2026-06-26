import { Invoice, InvoiceStatus } from '../types/billing.types';

export const MOCK_INVOICES: Invoice[] = Array.from({ length: 200 }).map((_, i) => {
  const statuses: InvoiceStatus[] = ['Paid', 'Unpaid', 'Overdue', 'Cancelled'];
  const amount = Math.floor(Math.random() * 80000) + 10000;
  const discount = Math.random() > 0.7 ? amount * 0.1 : 0;
  const subTotal = amount - discount;
  const taxAmount = subTotal * 0.18;
  const grandTotal = subTotal + taxAmount;
  
  return {
    id: `inv-${i + 1}`,
    invoiceNumber: `INV-2026-${1000 + i}`,
    customerName: `Student ${i + 1}`,
    items: [
      { description: 'Registration Fee', amount: amount * 0.2 },
      { description: 'Course Fee', amount: amount * 0.8 },
    ],
    subTotal,
    taxAmount,
    discount,
    grandTotal,
    paymentStatus: statuses[i % statuses.length],
    issueDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
    dueDate: new Date(Date.now() + Math.floor(Math.random() * 2000000000)).toISOString(),
  };
});
