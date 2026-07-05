from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.finance_analytics.repository import FinanceAnalyticsRepository
from app.modules.finance_analytics.schemas import (
    CollectionRateResponse,
    FinanceAnalyticsDashboardResponse,
    MonthlyComparisonResponse,
    OutstandingAnalysisResponse,
    PaymentMethodAnalysisItem,
    RefundAnalysisResponse,
    RevenueTrendItem,
    TopProgramRevenueItem,
)


class FinanceAnalyticsService:
    def __init__(self, db: AsyncSession):
        self.repository = FinanceAnalyticsRepository(db)

    async def get_dashboard(self) -> FinanceAnalyticsDashboardResponse:
        return FinanceAnalyticsDashboardResponse(
            revenue_trend=await self.get_revenue_trend(),
            monthly_comparison=await self.get_monthly_comparison(),
            payment_method_analysis=await self.get_payment_method_analysis(),
            collection_rate=await self.get_collection_rate(),
            refund_analysis=await self.get_refund_analysis(),
            outstanding_analysis=await self.get_outstanding_analysis(),
            top_program_revenue=await self.get_top_program_revenue(),
        )

    async def get_revenue_trend(self) -> list[RevenueTrendItem]:
        rows = await self.repository.get_revenue_trend()

        return [
            RevenueTrendItem(
                month=row[0].strftime("%Y-%m"),
                total_revenue=Decimal(str(row[1])),
                transaction_count=row[2],
            )
            for row in rows
        ]

    async def get_monthly_comparison(self) -> MonthlyComparisonResponse:
        now = datetime.now(timezone.utc)
        current_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

        if now.month == 1:
            previous_start = datetime(now.year - 1, 12, 1, tzinfo=timezone.utc)
        else:
            previous_start = datetime(now.year, now.month - 1, 1, tzinfo=timezone.utc)

        if now.month == 12:
            next_start = datetime(now.year + 1, 1, 1, tzinfo=timezone.utc)
        else:
            next_start = datetime(now.year, now.month + 1, 1, tzinfo=timezone.utc)

        current_revenue = Decimal(str(await self.repository.get_revenue_between(current_start, next_start)))
        previous_revenue = Decimal(str(await self.repository.get_revenue_between(previous_start, current_start)))
        revenue_difference = current_revenue - previous_revenue
        growth_percentage = 0.0

        if previous_revenue:
            growth_percentage = float((revenue_difference / previous_revenue) * 100)

        return MonthlyComparisonResponse(
            current_month_revenue=current_revenue,
            previous_month_revenue=previous_revenue,
            revenue_difference=revenue_difference,
            growth_percentage=growth_percentage,
        )

    async def get_payment_method_analysis(self) -> list[PaymentMethodAnalysisItem]:
        rows = await self.repository.get_payment_method_analysis()
        total_amount = Decimal(str(await self.repository.get_successful_payment_total()))

        return [
            PaymentMethodAnalysisItem(
                payment_method=row[0] or "unknown",
                transaction_count=row[1],
                total_amount=Decimal(str(row[2])),
                percentage=float((Decimal(str(row[2])) / total_amount) * 100) if total_amount else 0.0,
            )
            for row in rows
        ]

    async def get_collection_rate(self) -> CollectionRateResponse:
        total_invoices, paid_invoices = await self.repository.get_collection_rate_counts()

        return CollectionRateResponse(
            paid_invoices=paid_invoices,
            total_invoices=total_invoices,
            collection_percentage=float((paid_invoices / total_invoices) * 100)
            if total_invoices
            else 0.0,
        )

    async def get_refund_analysis(self) -> RefundAnalysisResponse:
        transaction_count, refund_count = await self.repository.get_refund_counts()
        refund_amount = Decimal(str(await self.repository.get_refund_total_amount()))

        return RefundAnalysisResponse(
            refund_count=refund_count,
            refund_amount=refund_amount,
            refund_percentage=float((refund_count / transaction_count) * 100)
            if transaction_count
            else 0.0,
        )

    async def get_outstanding_analysis(self) -> OutstandingAnalysisResponse:
        pending_count, pending_amount, overdue_count = await self.repository.get_outstanding_analysis()

        return OutstandingAnalysisResponse(
            pending_invoice_count=pending_count,
            pending_amount=Decimal(str(pending_amount)),
            overdue_invoice_count=overdue_count,
        )

    async def get_top_program_revenue(self) -> list[TopProgramRevenueItem]:
        rows = await self.repository.get_top_program_revenue()

        return [
            TopProgramRevenueItem(
                program=row[0],
                total_revenue=Decimal(str(row[1])),
            )
            for row in rows
        ]
