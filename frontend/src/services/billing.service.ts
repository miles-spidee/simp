import { Invoice, Receipt } from '../types/billing.types';
import { billingApi } from '../api/billing.api';
class BillingService {
  async getInvoices() {
    return await billingApi.getInvoices();
  }
  
  async getInvoiceById(id: string): Promise<Invoice> {
    return await billingApi.getInvoiceById(id);
  }

  async generateInvoice(data: Partial<Invoice>): Promise<Invoice> {
    return await billingApi.createInvoice(data);
  }

  async getReceipts() {
    return await billingApi.getReceipts();
  }

  async getReceiptById(id: string): Promise<Receipt> {
    return await billingApi.getReceiptById(id);
  }

  async generateReceipt(data: Partial<Receipt>): Promise<Receipt> {
    return await billingApi.createReceipt(data);
  }
  
  async getBillingSummary() {
    const invoices = await this.getInvoices();
    return {
      totalInvoiced: invoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
      totalPaid: invoices.filter(inv => inv.paymentStatus === 'Paid').reduce((sum, inv) => sum + inv.grandTotal, 0),
      totalPending: invoices.filter(inv => inv.paymentStatus === 'Unpaid' || inv.paymentStatus === 'Overdue').reduce((sum, inv) => sum + inv.grandTotal, 0),
    };
  }
}

export const billingService = new BillingService();
