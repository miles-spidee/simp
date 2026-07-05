from datetime import date, datetime, time, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.finance.billing import RefundRequest
from app.models.finance.invoice import Invoice
from app.models.finance.payment import PaymentTransaction
from app.modules.finance.schemas import (
    ActivityItem,
    FinanceDashboardResponse,
    MonthlyRevenueResponse,
    PendingDuesResponse,
    RefundSummaryResponse,
    TodayCollectionResponse,
    TransactionItem,
)
from app.repositories.base import BaseRepository


SUCCESS_STATUSES = ("captured", "success", "successful", "paid")


class FinanceRepository(
    BaseRepository[
        PaymentTransaction,
        FinanceDashboardResponse,
        FinanceDashboardResponse,
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

    async def get_today_collection(self) -> TodayCollectionResponse:
        today = datetime.now(timezone.utc).date()
        start = datetime.combine(today, time.min, tzinfo=timezone.utc)
        end = datetime.combine(today, time.max, tzinfo=timezone.utc)

        result = await self.db.execute(
            select(
                func.coalesce(func.sum(PaymentTransaction.amount), 0),
                func.count(PaymentTransaction.id),
            ).where(
                PaymentTransaction.created_at >= start,
                PaymentTransaction.created_at <= end,
                func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
            )
        )
        total_collection, transaction_count = result.one()

        return TodayCollectionResponse(
            total_collection=total_collection,
            transaction_count=transaction_count,
            growth_percentage=0,
        )

    async def get_monthly_revenue(self) -> MonthlyRevenueResponse:
        now = datetime.now(timezone.utc)
        start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        if now.month == 12:
            end = datetime(now.year + 1, 1, 1, tzinfo=timezone.utc)
        else:
            end = datetime(now.year, now.month + 1, 1, tzinfo=timezone.utc)

        result = await self.db.execute(
            select(
                func.coalesce(func.sum(PaymentTransaction.amount), 0),
                func.count(PaymentTransaction.id),
            ).where(
                PaymentTransaction.created_at >= start,
                PaymentTransaction.created_at < end,
                func.lower(PaymentTransaction.status).in_(SUCCESS_STATUSES),
            )
        )
        total_revenue, payment_count = result.one()

        # Compute collection rate: paid invoices / total invoices
        invoice_result = await self.db.execute(
            select(
                func.count(Invoice.id),
                func.count(Invoice.id).filter(func.lower(Invoice.payment_status) == "paid"),
            ).where(Invoice.deleted_at.is_(None))
        )
        total_invoices, paid_invoices = invoice_result.one()
        collection_rate = float((paid_invoices / total_invoices) * 100) if total_invoices else 0.0

        return MonthlyRevenueResponse(
            total_revenue=total_revenue,
            payment_count=payment_count,
            collection_rate=collection_rate,
            growth_percentage=0,
        )

    async def get_pending_dues(self) -> PendingDuesResponse:
        today = date.today()

        pending_result = await self.db.execute(
            select(
                func.coalesce(func.sum(Invoice.grand_total), 0),
                func.count(Invoice.id),
            ).where(
                Invoice.deleted_at.is_(None),
                func.lower(Invoice.payment_status) != "paid",
            )
        )
        pending_amount, pending_invoices = pending_result.one()

        overdue_result = await self.db.execute(
            select(func.count(Invoice.id)).where(
                Invoice.deleted_at.is_(None),
                func.lower(Invoice.payment_status) != "paid",
                Invoice.due_date < today,
            )
        )
        overdue_invoices = overdue_result.scalar_one()

        return PendingDuesResponse(
            pending_amount=pending_amount,
            pending_invoices=pending_invoices,
            overdue_invoices=overdue_invoices,
        )

    async def get_recent_transactions(self, limit: int = 10) -> list[TransactionItem]:
        result = await self.db.execute(
            select(PaymentTransaction)
            .where(PaymentTransaction.deleted_at.is_(None))
            .order_by(PaymentTransaction.created_at.desc())
            .limit(limit)
        )

        return [
            TransactionItem(
                transaction_id=transaction.transaction_id,
                amount=transaction.amount,
                payment_method=transaction.payment_method or "",
                status=transaction.status,
                created_at=transaction.created_at,
            )
            for transaction in result.scalars().all()
        ]

    async def get_refund_summary(self) -> RefundSummaryResponse:
        """Count RefundRequests by status for a real refund summary."""
        result = await self.db.execute(
            select(
                func.count(RefundRequest.id).filter(func.lower(RefundRequest.status) == "pending"),
                func.count(RefundRequest.id).filter(func.lower(RefundRequest.status) == "approved"),
                func.count(RefundRequest.id).filter(func.lower(RefundRequest.status) == "rejected"),
            ).where(RefundRequest.deleted_at.is_(None))
        )
        pending, approved, rejected = result.one()

        return RefundSummaryResponse(
            pending_refunds=pending,
            approved_refunds=approved,
            rejected_refunds=rejected,
        )

    async def get_recent_activity(self, limit: int = 10) -> list[ActivityItem]:
        result = await self.db.execute(
            select(PaymentTransaction)
            .where(PaymentTransaction.deleted_at.is_(None))
            .order_by(PaymentTransaction.created_at.desc())
            .limit(limit)
        )

        return [
            ActivityItem(
                activity_type="payment",
                title=f"Payment {transaction.status}",
                description=f"Transaction {transaction.transaction_id}",
                created_at=transaction.created_at,
            )
            for transaction in result.scalars().all()
        ]
