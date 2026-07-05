from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.billing.repository import BillingRepository
from app.modules.finance.repository import FinanceRepository
from app.modules.finance.schemas import (
    ActivityItem,
    FinanceDashboardResponse,
    FinanceDashboardSummaryResponse,
    MonthlyRevenueResponse,
    PendingDuesResponse,
    RefundSummaryResponse,
    TodayCollectionResponse,
    TransactionItem,
    WalletSummaryResponse,
)
from app.modules.payment.repository import PaymentRepository
from app.modules.wallet.repository import WalletRepository


class FinanceService:

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = FinanceRepository(db)
        self._billing_repo = BillingRepository(db)
        self._wallet_repo = WalletRepository(db)
        self._payment_repo = PaymentRepository(db)

    async def get_dashboard(self) -> FinanceDashboardResponse:
        today = await self.repository.get_today_collection()
        monthly = await self.repository.get_monthly_revenue()
        pending = await self.repository.get_pending_dues()
        transactions = await self.repository.get_recent_transactions()
        refunds = await self.get_pending_refunds()
        activity = await self.repository.get_recent_activity()
        wallet = await self.get_wallet_summary()

        return FinanceDashboardResponse(
            today_collection=today,
            monthly_revenue=monthly,
            pending_dues=pending,
            wallet=wallet,
            recent_transactions=transactions,
            refunds=refunds,
            recent_activity=activity,
        )

    async def get_dashboard_summary(self) -> FinanceDashboardSummaryResponse:
        return FinanceDashboardSummaryResponse(
            today_collection=await self.repository.get_today_collection(),
            monthly_revenue=await self.repository.get_monthly_revenue(),
            pending_dues=await self.repository.get_pending_dues(),
            wallet=await self.get_wallet_summary(),
            refunds=await self.get_pending_refunds(),
        )

    async def get_today_collection(self) -> TodayCollectionResponse:
        return await self.repository.get_today_collection()

    async def get_monthly_revenue(self) -> MonthlyRevenueResponse:
        return await self.repository.get_monthly_revenue()

    async def get_pending_dues(self) -> PendingDuesResponse:
        return await self.repository.get_pending_dues()

    async def get_wallet_summary(self) -> WalletSummaryResponse:
        """Pull real wallet totals from WalletRepository."""
        total_balance, _total_wallets, _frozen = await self._wallet_repo.get_dashboard_totals()
        total_credits, total_debits, refund_balance = await self._wallet_repo.get_transaction_totals()
        # operational_balance = credits collected minus debits paid out
        operational_balance = Decimal(str(total_credits)) - Decimal(str(total_debits))
        return WalletSummaryResponse(
            wallet_balance=Decimal(str(total_balance)),
            escrow_amount=Decimal("0"),
            refund_reserve=Decimal(str(refund_balance)),
            operational_balance=operational_balance if operational_balance >= 0 else Decimal("0"),
        )

    async def get_recent_transactions(self) -> list[TransactionItem]:
        return await self.repository.get_recent_transactions()

    async def get_pending_refunds(self) -> RefundSummaryResponse:
        """Count refund requests by status from billing repository."""
        refund_count = await self._billing_repo.get_refunded_invoice_count()
        payment_refund_count = await self._payment_repo.get_refund_request_count()
        return RefundSummaryResponse(
            pending_refunds=payment_refund_count,
            approved_refunds=refund_count,
            rejected_refunds=0,
        )

    async def get_recent_activity(self) -> list[ActivityItem]:
        return await self.repository.get_recent_activity()
