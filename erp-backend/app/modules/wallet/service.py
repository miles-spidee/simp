from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.wallet.repository import WalletRepository
from app.modules.wallet.schemas import (
    PaginatedWalletResponse,
    PaginatedWalletTransactionResponse,
    WalletCreditRequest,
    WalletDashboardResponse,
    WalletDebitRequest,
    WalletDetailResponse,
    WalletFreezeRequest,
    WalletOperationResponse,
    WalletRefundRequest,
)


class WalletService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = WalletRepository(db)

    async def get_dashboard(self) -> WalletDashboardResponse:
        total_balance, total_wallets, frozen_wallets = await self.repository.get_dashboard_totals()
        total_credits, total_debits, refund_balance = await self.repository.get_transaction_totals()
        recent_transactions = await self.repository.get_recent_transactions()

        return WalletDashboardResponse(
            total_system_wallet_balance=total_balance,
            total_credits=total_credits,
            total_debits=total_debits,
            total_wallets=total_wallets,
            frozen_wallets=frozen_wallets,
            refund_balance=refund_balance,
            recent_transactions=recent_transactions,
        )

    async def get_wallets(self, **kwargs) -> PaginatedWalletResponse:
        wallets, total = await self.repository.get_wallets(**kwargs)

        return PaginatedWalletResponse(
            items=wallets,
            total=total or 0,
            page=kwargs["page"],
            page_size=kwargs["page_size"],
        )

    async def get_wallet_detail(self, wallet_id: UUID) -> WalletDetailResponse:
        wallet = await self.repository.get_wallet_detail(wallet_id)
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")

        return WalletDetailResponse(
            wallet=wallet,
            transactions=wallet.transactions,
            adjustments=wallet.adjustments,
            refunds=wallet.refunds,
            limit=wallet.limit,
            freeze_history=wallet.freeze_history,
            audit_logs=wallet.audit_logs,
            current_balance=wallet.balance,
        )

    async def get_transactions(self, **kwargs) -> PaginatedWalletTransactionResponse:
        transactions, total = await self.repository.get_transactions(**kwargs)

        return PaginatedWalletTransactionResponse(
            items=transactions,
            total=total or 0,
            page=kwargs["page"],
            page_size=kwargs["page_size"],
        )

    async def credit_wallet(self, data: WalletCreditRequest) -> WalletOperationResponse:
        wallet = await self.repository.get_wallet_for_update(data.wallet_id)
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")
        if data.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than zero")

        await self._validate_credit_limit(wallet, data.amount)

        balance_before = Decimal(str(wallet.balance))
        balance_after = balance_before + data.amount
        wallet.balance = balance_after

        transaction = await self.repository.create_transaction(
            wallet_id=wallet.id,
            transaction_type="CREDIT",
            amount=data.amount,
            balance_before=balance_before,
            balance_after=balance_after,
            reference_type=data.reference_type,
            reference_id=data.reference_id,
            description=data.description,
        )
        await self.repository.create_audit_log(
            wallet_id=wallet.id,
            action="BALANCE_CREDITED",
            details={
                "amount": str(data.amount),
                "balance_before": str(balance_before),
                "balance_after": str(balance_after),
                "reference_type": data.reference_type,
                "reference_id": str(data.reference_id) if data.reference_id else None,
            },
            performed_by=data.performed_by,
            ip_address=data.ip_address,
        )

        await self.db.commit()
        await self.db.refresh(wallet)
        return WalletOperationResponse(wallet=wallet, transaction=transaction)

    async def debit_wallet(self, data: WalletDebitRequest) -> WalletOperationResponse:
        wallet = await self.repository.get_wallet_for_update(data.wallet_id)
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")
        if data.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than zero")
        if wallet.is_frozen:
            raise HTTPException(status_code=409, detail="Wallet is frozen")
        if wallet.status != "ACTIVE":
            raise HTTPException(status_code=409, detail="Wallet is not active")

        await self._validate_debit_limit(wallet, data.amount)

        balance_before = Decimal(str(wallet.balance))
        balance_after = balance_before - data.amount
        overdraft_limit = Decimal(str(wallet.limit.overdraft_limit or 0)) if wallet.limit else Decimal("0")
        overdraft_allowed = bool(wallet.limit and wallet.limit.overdraft_allowed)

        if balance_after < 0 and not overdraft_allowed:
            raise HTTPException(status_code=409, detail="Insufficient wallet balance")
        if balance_after < 0 and abs(balance_after) > overdraft_limit:
            raise HTTPException(status_code=409, detail="Wallet overdraft limit exceeded")

        wallet.balance = balance_after

        transaction = await self.repository.create_transaction(
            wallet_id=wallet.id,
            transaction_type="DEBIT",
            amount=data.amount,
            balance_before=balance_before,
            balance_after=balance_after,
            reference_type=data.reference_type,
            reference_id=data.reference_id,
            description=data.description,
        )
        await self.repository.create_audit_log(
            wallet_id=wallet.id,
            action="BALANCE_DEBITED",
            details={
                "amount": str(data.amount),
                "balance_before": str(balance_before),
                "balance_after": str(balance_after),
                "reference_type": data.reference_type,
                "reference_id": str(data.reference_id) if data.reference_id else None,
            },
            performed_by=data.performed_by,
            ip_address=data.ip_address,
        )

        await self.db.commit()
        await self.db.refresh(wallet)
        return WalletOperationResponse(wallet=wallet, transaction=transaction)

    async def freeze_wallet(self, data: WalletFreezeRequest) -> WalletOperationResponse:
        wallet = await self.repository.get_wallet_for_update(data.wallet_id)
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")

        wallet.is_frozen = True
        freeze_history = await self.repository.create_freeze_history(
            wallet_id=wallet.id,
            action="FREEZE",
            reason=data.reason,
            performed_by=data.performed_by,
        )
        await self.repository.create_audit_log(
            wallet_id=wallet.id,
            action="WALLET_FROZEN",
            details={"reason": data.reason},
            performed_by=data.performed_by,
            ip_address=data.ip_address,
        )

        await self.db.commit()
        await self.db.refresh(wallet)
        return WalletOperationResponse(wallet=wallet, freeze_history=freeze_history)

    async def unfreeze_wallet(self, data: WalletFreezeRequest) -> WalletOperationResponse:
        wallet = await self.repository.get_wallet_for_update(data.wallet_id)
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")

        wallet.is_frozen = False
        freeze_history = await self.repository.create_freeze_history(
            wallet_id=wallet.id,
            action="UNFREEZE",
            reason=data.reason,
            performed_by=data.performed_by,
        )
        await self.repository.create_audit_log(
            wallet_id=wallet.id,
            action="WALLET_UNFROZEN",
            details={"reason": data.reason},
            performed_by=data.performed_by,
            ip_address=data.ip_address,
        )

        await self.db.commit()
        await self.db.refresh(wallet)
        return WalletOperationResponse(wallet=wallet, freeze_history=freeze_history)

    async def refund_wallet(self, data: WalletRefundRequest) -> WalletOperationResponse:
        wallet = await self.repository.get_wallet_for_update(data.wallet_id)
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")

        refund_transaction = await self.repository.get_refund_transaction(data.refund_transaction_id)
        if not refund_transaction:
            raise HTTPException(status_code=404, detail="Refund transaction not found")

        amount = Decimal(str(refund_transaction.refund_amount))
        balance_before = Decimal(str(wallet.balance))
        balance_after = balance_before + amount
        wallet.balance = balance_after

        wallet_refund = await self.repository.create_refund(
            wallet_id=wallet.id,
            refund_amount=amount,
            reason=data.reason,
            source_transaction_id=refund_transaction.id,
            status="COMPLETED",
        )
        transaction = await self.repository.create_transaction(
            wallet_id=wallet.id,
            transaction_type="REFUND",
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
            reference_type="REFUND_TRANSACTION",
            reference_id=refund_transaction.id,
            description=data.reason,
        )
        await self.repository.create_audit_log(
            wallet_id=wallet.id,
            action="REFUND_CREDITED",
            details={
                "amount": str(amount),
                "balance_before": str(balance_before),
                "balance_after": str(balance_after),
                "refund_transaction_id": str(refund_transaction.id),
            },
            performed_by=data.performed_by,
            ip_address=data.ip_address,
        )

        await self.db.commit()
        await self.db.refresh(wallet)
        return WalletOperationResponse(wallet=wallet, transaction=transaction, refund=wallet_refund)

    async def export_wallets(self) -> list:
        wallets, _ = await self.repository.get_wallets(
            page=1,
            page_size=1000,
            search=None,
            sort_by="created_at",
            sort_order="desc",
            owner_type=None,
            wallet_status=None,
            is_frozen=None,
            organization_id=None,
        )
        return wallets

    async def _validate_credit_limit(self, wallet, amount: Decimal) -> None:
        wallet_limit = wallet.limit
        if not wallet_limit:
            return

        balance_after = Decimal(str(wallet.balance)) + amount
        if wallet_limit.max_balance is not None and balance_after > Decimal(str(wallet_limit.max_balance)):
            raise HTTPException(status_code=409, detail="Wallet maximum balance exceeded")

        if wallet_limit.daily_credit_limit is not None:
            daily_total = Decimal(str(await self.repository.get_daily_transaction_total(wallet.id, "CREDIT")))
            if daily_total + amount > Decimal(str(wallet_limit.daily_credit_limit)):
                raise HTTPException(status_code=409, detail="Daily wallet credit limit exceeded")

    async def _validate_debit_limit(self, wallet, amount: Decimal) -> None:
        wallet_limit = wallet.limit
        if not wallet_limit or wallet_limit.daily_debit_limit is None:
            return

        daily_total = Decimal(str(await self.repository.get_daily_transaction_total(wallet.id, "DEBIT")))
        if daily_total + amount > Decimal(str(wallet_limit.daily_debit_limit)):
            raise HTTPException(status_code=409, detail="Daily wallet debit limit exceeded")
