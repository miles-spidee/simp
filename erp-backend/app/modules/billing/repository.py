from datetime import date
from typing import Optional
from uuid import UUID

from sqlalchemy import delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.finance.billing import RefundRequest
from app.models.finance.invoice import Invoice, InvoiceItem
from app.models.finance.payment import PaymentTransaction
from app.models.finance.receipt import Receipt
from app.modules.billing.schemas import InvoiceCreate, InvoiceUpdate
from app.repositories.base import BaseRepository


class BillingRepository(BaseRepository[Invoice, InvoiceCreate, InvoiceUpdate]):
    def __init__(self, db: AsyncSession):
        self.db = db
        super().__init__(
            Invoice,
            search_fields=["invoice_number", "payment_status"],
        )

    async def get_dashboard_counts(self):
        today = date.today()

        result = await self.db.execute(
            select(
                func.count(Invoice.id),
                func.count(Invoice.id).filter(func.lower(Invoice.payment_status) == "paid"),
                func.count(Invoice.id).filter(func.lower(Invoice.payment_status) != "paid"),
                func.count(Invoice.id).filter(
                    func.lower(Invoice.payment_status) != "paid",
                    Invoice.due_date < today,
                ),
                func.coalesce(func.sum(Invoice.grand_total).filter(func.lower(Invoice.payment_status) == "paid"), 0),
                func.coalesce(func.sum(Invoice.grand_total).filter(func.lower(Invoice.payment_status) != "paid"), 0),
            ).where(Invoice.deleted_at.is_(None))
        )
        return result.one()

    async def get_refunded_invoice_count(self):
        result = await self.db.execute(
            select(func.count(func.distinct(RefundRequest.invoice_id))).where(
                RefundRequest.deleted_at.is_(None)
            )
        )
        return result.scalar_one()

    async def get_recent_invoices(self, limit: int = 5):
        result = await self.db.execute(
            select(Invoice)
            .options(selectinload(Invoice.items))
            .where(Invoice.deleted_at.is_(None))
            .order_by(Invoice.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_invoices(
        self,
        *,
        page: int,
        page_size: int,
        search: Optional[str],
        sort_by: str,
        sort_order: str,
        status: Optional[str],
        payment_status: Optional[str],
        date_from: Optional[date],
        date_to: Optional[date],
        organization_id: Optional[UUID],
    ):
        stmt = (
            select(Invoice)
            .options(selectinload(Invoice.items))
            .where(Invoice.deleted_at.is_(None))
        )

        if search:
            stmt = stmt.where(
                or_(
                    Invoice.invoice_number.ilike(f"%{search}%"),
                    Invoice.payment_status.ilike(f"%{search}%"),
                )
            )
        if status:
            stmt = stmt.where(func.lower(Invoice.payment_status) == status.lower())
        if payment_status:
            stmt = stmt.where(func.lower(Invoice.payment_status) == payment_status.lower())
        if date_from:
            stmt = stmt.where(Invoice.issue_date >= date_from)
        if date_to:
            stmt = stmt.where(Invoice.issue_date <= date_to)
        if organization_id:
            stmt = stmt.where(Invoice.company_id == organization_id)

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))

        sort_column = getattr(Invoice, sort_by, Invoice.created_at)
        if sort_order.lower() == "asc":
            stmt = stmt.order_by(sort_column.asc())
        else:
            stmt = stmt.order_by(sort_column.desc())

        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(stmt)
        return result.scalars().all(), total

    async def get_invoice(self, invoice_id: UUID):
        result = await self.db.execute(
            select(Invoice)
            .options(
                selectinload(Invoice.items),
                selectinload(Invoice.reminders),
                selectinload(Invoice.refund_requests).selectinload(RefundRequest.refund_transaction),
            )
            .where(
                Invoice.id == invoice_id,
                Invoice.deleted_at.is_(None),
            )
        )
        return result.scalars().first()

    async def create_invoice(self, invoice_data: dict, items: list[dict]):
        invoice = Invoice(**invoice_data)
        self.db.add(invoice)
        await self.db.flush()

        for item in items:
            self.db.add(InvoiceItem(invoice_id=invoice.id, **item))

        await self.db.flush()
        await self.db.refresh(invoice)
        return await self.get_invoice(invoice.id)

    async def update_invoice(self, invoice: Invoice, invoice_data: dict, items: Optional[list[dict]]):
        for key, value in invoice_data.items():
            setattr(invoice, key, value)

        self.db.add(invoice)
        await self.db.flush()

        if items is not None:
            await self.db.execute(delete(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id))
            for item in items:
                self.db.add(InvoiceItem(invoice_id=invoice.id, **item))
            await self.db.flush()

        await self.db.refresh(invoice)
        return await self.get_invoice(invoice.id)

    async def get_receipts(
        self,
        *,
        page: int,
        page_size: int,
        search: Optional[str],
        sort_by: str,
        sort_order: str,
    ):
        stmt = select(Receipt).where(Receipt.deleted_at.is_(None))

        if search:
            stmt = stmt.where(
                or_(
                    Receipt.receipt_number.ilike(f"%{search}%"),
                    Receipt.payment_method.ilike(f"%{search}%"),
                    Receipt.transaction_id.ilike(f"%{search}%"),
                )
            )

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))

        sort_column = getattr(Receipt, sort_by, Receipt.created_at)
        if sort_order.lower() == "asc":
            stmt = stmt.order_by(sort_column.asc())
        else:
            stmt = stmt.order_by(sort_column.desc())

        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(stmt)
        return result.scalars().all(), total

    async def get_receipt(self, receipt_id: UUID):
        result = await self.db.execute(
            select(Receipt).where(
                Receipt.id == receipt_id,
                Receipt.deleted_at.is_(None),
            )
        )
        return result.scalars().first()

    async def get_receipt_by_invoice(self, invoice_id: UUID):
        result = await self.db.execute(
            select(Receipt)
            .where(
                Receipt.invoice_id == invoice_id,
                Receipt.deleted_at.is_(None),
            )
            .order_by(Receipt.created_at.desc())
        )
        return result.scalars().first()

    async def get_payment_transaction_by_receipt(self, receipt: Receipt):
        if not receipt.transaction_id:
            return None

        result = await self.db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.deleted_at.is_(None),
                PaymentTransaction.razorpay_payment_id == receipt.transaction_id,
            )
        )
        return result.scalars().first()

    async def get_payment_status(
        self,
        *,
        page: int,
        page_size: int,
        search: Optional[str],
        status: Optional[str],
        sort_by: str,
        sort_order: str,
    ):
        stmt = select(PaymentTransaction).where(PaymentTransaction.deleted_at.is_(None))

        if search:
            stmt = stmt.where(
                or_(
                    PaymentTransaction.transaction_id.ilike(f"%{search}%"),
                    PaymentTransaction.razorpay_order_id.ilike(f"%{search}%"),
                    PaymentTransaction.razorpay_payment_id.ilike(f"%{search}%"),
                    PaymentTransaction.customer_email.ilike(f"%{search}%"),
                    PaymentTransaction.customer_name.ilike(f"%{search}%"),
                )
            )
        if status:
            stmt = stmt.where(func.lower(PaymentTransaction.status) == status.lower())

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))

        sort_column = getattr(PaymentTransaction, sort_by, PaymentTransaction.created_at)
        if sort_order.lower() == "asc":
            stmt = stmt.order_by(sort_column.asc())
        else:
            stmt = stmt.order_by(sort_column.desc())

        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(stmt)
        return result.scalars().all(), total
