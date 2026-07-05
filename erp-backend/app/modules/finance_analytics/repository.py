from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.academic.program import Program
from app.models.finance.billing import RefundRequest, RefundTransaction
from app.models.finance.fee import FeeStructure
from app.models.finance.invoice import Invoice
from app.models.finance.payment import PaymentTransaction
from app.repositories.base import BaseRepository


SUCCESS_STATUSES = ("captured", "success", "successful", "paid")


class FinanceAnalyticsRepository(
    BaseRepository[
        PaymentTransaction,
        PaymentTransaction,
        PaymentTransaction,
    ]
):
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

    async def get_revenue_trend(self):
        """Monthly revenue trend over all time, grouped by month."""
        month = func.date_trunc("month", PaymentTransaction.created_at).label("month")

        result = await self.db.execute(
            select(
                month,
                func.coalesce(func.sum(PaymentTransaction.amount), 0),
                func.count(PaymentTransaction.id),
            )
            .where(
                PaymentTransaction.deleted_at.is_(None),
                func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
            )
            .group_by(month)
            .order_by(month)
        )
        return result.all()

    async def get_revenue_between(self, start: datetime, end: datetime) -> Decimal:
        """Total successful payment revenue between two datetimes."""
        result = await self.db.execute(
            select(func.coalesce(func.sum(PaymentTransaction.amount), 0)).where(
                PaymentTransaction.deleted_at.is_(None),
                PaymentTransaction.created_at >= start,
                PaymentTransaction.created_at < end,
                func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
            )
        )
        return result.scalar_one()

    async def get_payment_method_analysis(self):
        """Count and total amount per payment method for successful payments."""
        total_amount = func.coalesce(func.sum(PaymentTransaction.amount), 0)

        result = await self.db.execute(
            select(
                PaymentTransaction.payment_method,
                func.count(PaymentTransaction.id),
                total_amount,
            )
            .where(
                PaymentTransaction.deleted_at.is_(None),
                func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
            )
            .group_by(PaymentTransaction.payment_method)
            .order_by(total_amount.desc())
        )
        return result.all()

    async def get_successful_payment_total(self) -> Decimal:
        """Grand total of all successful payments."""
        result = await self.db.execute(
            select(func.coalesce(func.sum(PaymentTransaction.amount), 0)).where(
                PaymentTransaction.deleted_at.is_(None),
                func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
            )
        )
        return result.scalar_one()

    async def get_collection_rate_counts(self):
        """Return (total_invoices, paid_invoices)."""
        result = await self.db.execute(
            select(
                func.count(Invoice.id),
                func.count(Invoice.id).filter(func.lower(Invoice.payment_status) == "paid"),
            ).where(Invoice.deleted_at.is_(None))
        )
        return result.one()

    async def get_refund_counts(self):
        """Return (total_transactions, refund_transaction_count)."""
        result = await self.db.execute(
            select(
                func.count(PaymentTransaction.id),
                func.count(PaymentTransaction.id).filter(PaymentTransaction.refund.is_(True)),
            ).where(PaymentTransaction.deleted_at.is_(None))
        )
        return result.one()

    async def get_refund_total_amount(self) -> Decimal:
        """Sum of all completed refund transaction amounts."""
        result = await self.db.execute(
            select(
                func.coalesce(func.sum(RefundTransaction.refund_amount), 0),
            )
        )
        return result.scalar_one()

    async def get_outstanding_analysis(self):
        """Return (pending_count, pending_amount, overdue_count) for unpaid invoices."""
        today = date.today()

        result = await self.db.execute(
            select(
                func.count(Invoice.id),
                func.coalesce(func.sum(Invoice.grand_total), 0),
                func.count(Invoice.id).filter(Invoice.due_date < today),
            ).where(
                Invoice.deleted_at.is_(None),
                func.lower(Invoice.payment_status) != "paid",
            )
        )
        return result.one()

    async def get_top_program_revenue(self, limit: int = 10):
        """Aggregate fee revenue per program using FeeStructure."""
        result = await self.db.execute(
            select(
                Program.name,
                func.coalesce(func.sum(FeeStructure.amount), 0).label("total_revenue"),
            )
            .join(FeeStructure, FeeStructure.program_id == Program.id)
            .where(Program.deleted_at.is_(None))
            .group_by(Program.id, Program.name)
            .order_by(func.sum(FeeStructure.amount).desc())
            .limit(limit)
        )
        return result.all()
