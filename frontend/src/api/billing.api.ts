import { Invoice, Receipt } from '../types/billing.types';
import { MOCK_INVOICES } from '../data/mock-invoices';
import { MOCK_RECEIPTS } from '../data/mock-receipts';

export const billingApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_INVOICES), 600));
  },
  getReceipts: async (): Promise<Receipt[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_RECEIPTS), 500));
  }
};
