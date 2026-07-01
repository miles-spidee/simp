import { apiClient } from './api.client';
import { Invoice, Receipt } from '../types/billing.types';
import {} from '../types/invoices.types';
import {} from '../types/receipts.types';

export const billingApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    try {
      const res = await apiClient.get('/api/v1/billing');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getInvoiceById: async (id: string): Promise<Invoice> => {
    try {
      const res = await apiClient.get('/api/v1/billing');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    try {
      const res = await apiClient.post('/api/v1/billing', data);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  getReceipts: async (): Promise<Receipt[]> => {
    try {
      const res = await apiClient.get('/api/v1/billing');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  getReceiptById: async (id: string): Promise<Receipt> => {
    try {
      const res = await apiClient.get('/api/v1/billing');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
  createReceipt: async (data: Partial<Receipt>): Promise<Receipt> => {
    try {
      const res = await apiClient.post('/api/v1/billing', data);
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
