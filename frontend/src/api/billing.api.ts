import { Invoice, Receipt } from '../types/billing.types';
import { MOCK_INVOICES } from '../data/mock-invoices';
import { MOCK_RECEIPTS } from '../data/mock-receipts';

export const billingApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_INVOICES]), 600));
  },
  getInvoiceById: async (id: string): Promise<Invoice> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const inv = MOCK_INVOICES.find(x => x.id === id);
        if (inv) resolve(inv);
        else reject(new Error('Not found'));
      }, 600);
    });
  },
  generateInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const inv = { id: `INV-${Date.now()}`, invoiceNumber: `INV-2024-${Date.now()}`, ...data } as Invoice;
        resolve(inv);
      }, 600);
    });
  },
  getReceipts: async (): Promise<Receipt[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_RECEIPTS]), 600));
  },
  getReceiptById: async (id: string): Promise<Receipt> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rec = MOCK_RECEIPTS.find(x => x.id === id);
        if (rec) resolve(rec);
        else reject(new Error('Not found'));
      }, 600);
    });
  },
  generateReceipt: async (data: Partial<Receipt>): Promise<Receipt> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rec = { id: `REC-${Date.now()}`, receiptNumber: `REC-2024-${Date.now()}`, ...data } as Receipt;
        resolve(rec);
      }, 600);
    });
  }
};
