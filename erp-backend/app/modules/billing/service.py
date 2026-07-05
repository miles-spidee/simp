from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.billing.repository import BillingRepository
from app.modules.billing.schemas import (
    BillingDashboardResponse,
    InvoiceCreate,
    InvoiceDetailResponse,
    InvoiceResponse,
    InvoiceUpdate,
    PaginatedInvoiceResponse,
    PaginatedPaymentStatusResponse,
    PaginatedReceiptResponse,
)


class BillingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = BillingRepository(db)

    async def get_dashboard(self) -> BillingDashboardResponse:
        (
            total_invoices,
            paid_invoices,
            unpaid_invoices,
            overdue_invoices,
            total_revenue,
            outstanding_amount,
        ) = await self.repository.get_dashboard_counts()
        refunded_invoices = await self.repository.get_refunded_invoice_count()
        recent_invoices = await self.repository.get_recent_invoices()

        return BillingDashboardResponse(
            total_invoices=total_invoices,
            paid_invoices=paid_invoices,
            unpaid_invoices=unpaid_invoices,
            overdue_invoices=overdue_invoices,
            refunded_invoices=refunded_invoices,
            total_revenue=total_revenue,
            outstanding_amount=outstanding_amount,
            recent_invoices=recent_invoices,
        )

    async def get_invoices(self, **kwargs) -> PaginatedInvoiceResponse:
        invoices, total = await self.repository.get_invoices(**kwargs)

        return PaginatedInvoiceResponse(
            items=invoices,
            total=total or 0,
            page=kwargs["page"],
            page_size=kwargs["page_size"],
        )

    async def get_invoice_detail(self, invoice_id: UUID) -> InvoiceDetailResponse:
        invoice = await self.repository.get_invoice(invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")

        receipt = await self.repository.get_receipt_by_invoice(invoice.id)
        payment_transaction = None
        if receipt:
            payment_transaction = await self.repository.get_payment_transaction_by_receipt(receipt)

        return InvoiceDetailResponse(
            invoice=invoice,
            receipt=receipt,
            payment_status=invoice.payment_status,
            payment_transaction=payment_transaction,
            reminder_history=invoice.reminders,
            refund_requests=invoice.refund_requests,
        )

    async def create_invoice(self, data: InvoiceCreate) -> InvoiceResponse:
        if not data.items:
            raise HTTPException(status_code=400, detail="Invoice items are required")

        invoice_data = data.model_dump(exclude={"items"})
        item_data = [item.model_dump() for item in data.items]
        invoice = await self.repository.create_invoice(invoice_data, item_data)
        await self.db.commit()
        return invoice

    async def update_invoice(self, invoice_id: UUID, data: InvoiceUpdate) -> InvoiceResponse:
        invoice = await self.repository.get_invoice(invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")

        payload = data.model_dump(exclude_unset=True)
        items = payload.pop("items", None)
        item_data = [item.model_dump() for item in items] if items is not None else None

        invoice = await self.repository.update_invoice(invoice, payload, item_data)
        await self.db.commit()
        return invoice

    async def get_receipts(self, **kwargs) -> PaginatedReceiptResponse:
        receipts, total = await self.repository.get_receipts(**kwargs)

        return PaginatedReceiptResponse(
            items=receipts,
            total=total or 0,
            page=kwargs["page"],
            page_size=kwargs["page_size"],
        )

    async def get_receipt(self, receipt_id: UUID):
        receipt = await self.repository.get_receipt(receipt_id)
        if not receipt:
            raise HTTPException(status_code=404, detail="Receipt not found")
        return receipt

    async def get_payment_status(self, **kwargs) -> PaginatedPaymentStatusResponse:
        transactions, total = await self.repository.get_payment_status(**kwargs)

        return PaginatedPaymentStatusResponse(
            items=transactions,
            total=total or 0,
            page=kwargs["page"],
            page_size=kwargs["page_size"],
        )

    def calculate_invoice_total(self, data: InvoiceCreate) -> Decimal:
        return data.sub_total + data.tax_amount - data.discount
