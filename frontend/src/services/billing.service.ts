import { billingApi } from '../api/billing.api';

class BillingService {
  async getInvoices() {
    return await billingApi.getInvoices();
  }
  
  async getReceipts() {
    return await billingApi.getReceipts();
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
