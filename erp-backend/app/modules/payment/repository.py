from datetime import date, datetime, time, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.finance.billing import RefundRequest, RefundTransaction
from app.models.finance.invoice import Invoice
from app.models.finance.payment import PaymentTransaction
from app.models.finance.payment_collection import (
    PaymentGatewayLog,
    PaymentLog,
    PaymentReconciliation,
)
from app.models.finance.receipt import Receipt
from app.models.finance.wallet import WalletRefund
from app.modules.payment.schemas import ManualPaymentRequest
from app.repositories.base import BaseRepository


SUCCESS_STATUSES = ("captured", "success", "successful", "paid")


class PaymentRepository(BaseRepository[PaymentTransaction, ManualPaymentRequest, ManualPaymentRequest]):
    def __init__(self, db: AsyncSession):
        self.db = db
        super().__init__(
            PaymentTransaction,
            search_fields=[
                "transaction_id",
                "status",
                "payment_method",
                "customer_name",
                "customer_email",
            ],
        )

    async def get_dashboard_totals(self):
        today = datetime.now(timezone.utc).date()
        today_start = datetime.combine(today, time.min, tzinfo=timezone.utc)
        today_end = datetime.combine(today, time.max, tzinfo=timezone.utc)
        month_start = datetime(today.year, today.month, 1, tzinfo=timezone.utc)
        month_end = (
            datetime(today.year + 1, 1, 1, tzinfo=timezone.utc)
            if today.month == 12
            else datetime(today.year, today.month + 1, 1, tzinfo=timezone.utc)
        )

        result = await self.db.execute(
            select(
                func.coalesce(func.sum(PaymentTransaction.amount).filter(
                    PaymentTransaction.created_at >= today_start,
                    PaymentTransaction.created_at <= today_end,
                    func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
                ), 0),
                func.coalesce(func.sum(PaymentTransaction.amount).filter(
                    PaymentTransaction.created_at >= month_start,
                    PaymentTransaction.created_at < month_end,
                    func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
                ), 0),
                func.count(PaymentTransaction.id).filter(func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES)),
                func.count(PaymentTransaction.id).filter(func.lower(PaymentTransaction.status) == "failed"),
                func.count(PaymentTransaction.id).filter(func.lower(PaymentTransaction.status).in_(("created", "authorized", "pending"))),
                func.count(PaymentTransaction.id),
            ).where(PaymentTransaction.deleted_at.is_(None))
        )
        return result.one()

    async def get_outstanding_amount(self):
        result = await self.db.execute(
            select(func.coalesce(func.sum(Invoice.grand_total), 0)).where(
                Invoice.deleted_at.is_(None),
                func.lower(Invoice.payment_status) != "paid",
            )
        )
        return result.scalar_one()

    async def get_refund_request_count(self):
        result = await self.db.execute(
            select(func.count(RefundRequest.id)).where(RefundRequest.deleted_at.is_(None))
        )
        return result.scalar_one()

    async def get_recent_transactions(self, limit: int = 10):
        result = await self.db.execute(
            select(PaymentTransaction)
            .where(PaymentTransaction.deleted_at.is_(None))
            .order_by(PaymentTransaction.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_payments(
        self,
        *,
        page: int,
        page_size: int,
        search: Optional[str],
        sort_by: str,
        sort_order: str,
        status: Optional[str],
        payment_method: Optional[str],
        gateway: Optional[str],
        date_from: Optional[date],
        date_to: Optional[date],
        organization_id: Optional[UUID],
    ):
        stmt = select(PaymentTransaction).where(PaymentTransaction.deleted_at.is_(None))

        if search:
            stmt = stmt.where(
                or_(
                    PaymentTransaction.transaction_id.ilike(f"%{search}%"),
                    PaymentTransaction.razorpay_order_id.ilike(f"%{search}%"),
                    PaymentTransaction.razorpay_payment_id.ilike(f"%{search}%"),
                    PaymentTransaction.customer_name.ilike(f"%{search}%"),
                    PaymentTransaction.customer_email.ilike(f"%{search}%"),
                )
            )
        if status:
            stmt = stmt.where(func.lower(PaymentTransaction.status) == status.lower())
        if payment_method:
            stmt = stmt.where(func.lower(PaymentTransaction.payment_method) == payment_method.lower())
        if gateway:
            stmt = stmt.where(PaymentTransaction.gateway_response.ilike(f"%{gateway}%"))
        if date_from:
            stmt = stmt.where(PaymentTransaction.created_at >= datetime.combine(date_from, time.min))
        if date_to:
            stmt = stmt.where(PaymentTransaction.created_at <= datetime.combine(date_to, time.max))

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))
        sort_column = getattr(PaymentTransaction, sort_by, PaymentTransaction.created_at)
        stmt = stmt.order_by(sort_column.asc() if sort_order.lower() == "asc" else sort_column.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        return result.scalars().all(), total

    async def get_payment_detail(self, payment_id: UUID):
        result = await self.db.execute(
            select(PaymentTransaction)
            .options(
                selectinload(PaymentTransaction.gateway_logs),
                selectinload(PaymentTransaction.reconciliations),
                selectinload(PaymentTransaction.payment_logs),
            )
            .where(
                PaymentTransaction.id == payment_id,
                PaymentTransaction.deleted_at.is_(None),
            )
        )
        return result.scalars().first()

    async def get_invoice_by_id(self, invoice_id: UUID):
        result = await self.db.execute(
            select(Invoice).where(Invoice.id == invoice_id, Invoice.deleted_at.is_(None))
        )
        return result.scalars().first()

    async def get_invoice_by_payment(self, payment: PaymentTransaction):
        if not payment.receipt:
            return None
        receipt = await self.get_receipt_by_number(payment.receipt)
        if not receipt or not receipt.invoice_id:
            return None
        return await self.get_invoice_by_id(receipt.invoice_id)

    async def get_receipt_by_number(self, receipt_number: str):
        result = await self.db.execute(
            select(Receipt).where(
                Receipt.receipt_number == receipt_number,
                Receipt.deleted_at.is_(None),
            )
        )
        return result.scalars().first()

    async def get_receipt_by_transaction_id(self, transaction_id: str):
        result = await self.db.execute(
            select(Receipt).where(
                Receipt.transaction_id == transaction_id,
                Receipt.deleted_at.is_(None),
            )
        )
        return result.scalars().first()

    async def get_receipt_by_id(self, receipt_id: UUID):
        result = await self.db.execute(
            select(Receipt).where(Receipt.id == receipt_id, Receipt.deleted_at.is_(None))
        )
        return result.scalars().first()

    async def get_refund_requests_by_invoice(self, invoice_id: UUID):
        result = await self.db.execute(
            select(RefundRequest)
            .options(selectinload(RefundRequest.refund_transaction))
            .where(RefundRequest.invoice_id == invoice_id, RefundRequest.deleted_at.is_(None))
        )
        return result.scalars().all()

    async def create_payment_transaction(self, data: dict):
        transaction = PaymentTransaction(**data)
        self.db.add(transaction)
        await self.db.flush()
        await self.db.refresh(transaction)
        return transaction

    async def create_payment_log(self, data: dict):
        log = PaymentLog(**data)
        self.db.add(log)
        await self.db.flush()
        await self.db.refresh(log)
        return log

    async def create_gateway_log(self, data: dict):
        log = PaymentGatewayLog(**data)
        self.db.add(log)
        await self.db.flush()
        await self.db.refresh(log)
        return log

    async def create_refund_request(self, data: dict):
        refund_request = RefundRequest(**data)
        self.db.add(refund_request)
        await self.db.flush()
        await self.db.refresh(refund_request)
        return refund_request

    async def create_refund_transaction(self, data: dict):
        refund_transaction = RefundTransaction(**data)
        self.db.add(refund_transaction)
        await self.db.flush()
        await self.db.refresh(refund_transaction)
        return refund_transaction

    async def create_wallet_refund(self, data: dict):
        wallet_refund = WalletRefund(**data)
        self.db.add(wallet_refund)
        await self.db.flush()
        await self.db.refresh(wallet_refund)
        return wallet_refund

    async def get_reconciliation(self, *, page: int, page_size: int, status: Optional[str]):
        stmt = select(PaymentReconciliation).where(PaymentReconciliation.deleted_at.is_(None))
        if status:
            stmt = stmt.where(func.lower(PaymentReconciliation.match_status) == status.lower())

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))
        stmt = stmt.order_by(PaymentReconciliation.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        return result.scalars().all(), total
