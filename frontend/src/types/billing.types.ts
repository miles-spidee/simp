export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  items: InvoiceItem[];
  subTotal: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
  paymentStatus: InvoiceStatus;
  issueDate: string;
  dueDate: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  invoiceNumber: string;
  customerName: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId: string;
}
