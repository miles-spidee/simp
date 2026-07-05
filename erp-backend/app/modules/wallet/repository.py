from datetime import datetime, time, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.finance.billing import RefundTransaction
from app.models.finance.wallet import (
    Wallet,
    WalletAuditLog,
    WalletFreezeHistory,
    WalletRefund,
    WalletTransaction,
)
from app.modules.wallet.schemas import WalletCreditRequest
from app.repositories.base import BaseRepository


class WalletRepository(BaseRepository[Wallet, WalletCreditRequest, WalletCreditRequest]):
    def __init__(self, db: AsyncSession):
        self.db = db
        super().__init__(
            Wallet,
            search_fields=["owner_type", "status", "currency"],
        )

    async def get_dashboard_totals(self):
        result = await self.db.execute(
            select(
                func.coalesce(func.sum(Wallet.balance), 0),
                func.count(Wallet.id),
                func.count(Wallet.id).filter(Wallet.is_frozen.is_(True)),
            ).where(Wallet.deleted_at.is_(None))
        )
        return result.one()

    async def get_transaction_totals(self):
        result = await self.db.execute(
            select(
                func.coalesce(func.sum(WalletTransaction.amount).filter(WalletTransaction.transaction_type == "CREDIT"), 0),
                func.coalesce(func.sum(WalletTransaction.amount).filter(WalletTransaction.transaction_type == "DEBIT"), 0),
                func.coalesce(func.sum(WalletTransaction.amount).filter(WalletTransaction.transaction_type == "REFUND"), 0),
            ).where(WalletTransaction.deleted_at.is_(None))
        )
        return result.one()

    async def get_recent_transactions(self, limit: int = 10):
        result = await self.db.execute(
            select(WalletTransaction)
            .where(WalletTransaction.deleted_at.is_(None))
            .order_by(WalletTransaction.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_wallets(
        self,
        *,
        page: int,
        page_size: int,
        search: Optional[str],
        sort_by: str,
        sort_order: str,
        owner_type: Optional[str],
        wallet_status: Optional[str],
        is_frozen: Optional[bool],
        organization_id: Optional[UUID],
    ):
        stmt = select(Wallet).where(Wallet.deleted_at.is_(None))

        if search:
            stmt = stmt.where(
                or_(
                    Wallet.owner_type.ilike(f"%{search}%"),
                    Wallet.status.ilike(f"%{search}%"),
                    Wallet.currency.ilike(f"%{search}%"),
                )
            )
        if owner_type:
            stmt = stmt.where(func.lower(Wallet.owner_type) == owner_type.lower())
        if wallet_status:
            stmt = stmt.where(func.lower(Wallet.status) == wallet_status.lower())
        if is_frozen is not None:
            stmt = stmt.where(Wallet.is_frozen.is_(is_frozen))
        if organization_id:
            stmt = stmt.where(
                func.lower(Wallet.owner_type) == "organization",
                Wallet.owner_id == organization_id,
            )

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))
        sort_column = getattr(Wallet, sort_by, Wallet.created_at)
        stmt = stmt.order_by(sort_column.asc() if sort_order.lower() == "asc" else sort_column.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        return result.scalars().all(), total

    async def get_wallet_detail(self, wallet_id: UUID):
        result = await self.db.execute(
            select(Wallet)
            .options(
                selectinload(Wallet.transactions),
                selectinload(Wallet.adjustments),
                selectinload(Wallet.refunds),
                selectinload(Wallet.limit),
                selectinload(Wallet.freeze_history),
                selectinload(Wallet.audit_logs),
            )
            .where(
                Wallet.id == wallet_id,
                Wallet.deleted_at.is_(None),
            )
        )
        return result.scalars().first()

    async def get_wallet_for_update(self, wallet_id: UUID):
        result = await self.db.execute(
            select(Wallet)
            .options(selectinload(Wallet.limit))
            .where(
                Wallet.id == wallet_id,
                Wallet.deleted_at.is_(None),
            )
            .with_for_update()
        )
        return result.scalars().first()

    async def get_transactions(
        self,
        *,
        page: int,
        page_size: int,
        search: Optional[str],
        sort_by: str,
        sort_order: str,
        wallet_id: Optional[UUID],
        transaction_type: Optional[str],
        reference_type: Optional[str],
    ):
        stmt = select(WalletTransaction).where(WalletTransaction.deleted_at.is_(None))

        if search:
            stmt = stmt.where(
                or_(
                    WalletTransaction.transaction_type.ilike(f"%{search}%"),
                    WalletTransaction.reference_type.ilike(f"%{search}%"),
                    WalletTransaction.description.ilike(f"%{search}%"),
                )
            )
        if wallet_id:
            stmt = stmt.where(WalletTransaction.wallet_id == wallet_id)
        if transaction_type:
            stmt = stmt.where(func.lower(WalletTransaction.transaction_type) == transaction_type.lower())
        if reference_type:
            stmt = stmt.where(func.lower(WalletTransaction.reference_type) == reference_type.lower())

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))
        sort_column = getattr(WalletTransaction, sort_by, WalletTransaction.created_at)
        stmt = stmt.order_by(sort_column.asc() if sort_order.lower() == "asc" else sort_column.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        return result.scalars().all(), total

    async def get_daily_transaction_total(self, wallet_id: UUID, transaction_type: str):
        today = datetime.now(timezone.utc).date()
        start = datetime.combine(today, time.min, tzinfo=timezone.utc)
        end = datetime.combine(today, time.max, tzinfo=timezone.utc)

        result = await self.db.execute(
            select(func.coalesce(func.sum(WalletTransaction.amount), 0)).where(
                WalletTransaction.wallet_id == wallet_id,
                WalletTransaction.transaction_type == transaction_type,
                WalletTransaction.created_at >= start,
                WalletTransaction.created_at <= end,
                WalletTransaction.deleted_at.is_(None),
            )
        )
        return result.scalar_one()

    async def create_transaction(
        self,
        *,
        wallet_id: UUID,
        transaction_type: str,
        amount,
        balance_before,
        balance_after,
        reference_type: Optional[str],
        reference_id: Optional[UUID],
        description: Optional[str],
    ):
        transaction = WalletTransaction(
            wallet_id=wallet_id,
            transaction_type=transaction_type,
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
            reference_type=reference_type,
            reference_id=reference_id,
            description=description,
        )
        self.db.add(transaction)
        await self.db.flush()
        await self.db.refresh(transaction)
        return transaction

    async def create_refund(
        self,
        *,
        wallet_id: UUID,
        refund_amount,
        reason: Optional[str],
        source_transaction_id: Optional[UUID],
        status: str,
    ):
        refund = WalletRefund(
            wallet_id=wallet_id,
            refund_amount=refund_amount,
            reason=reason,
            source_transaction_id=source_transaction_id,
            status=status,
        )
        self.db.add(refund)
        await self.db.flush()
        await self.db.refresh(refund)
        return refund

    async def create_freeze_history(
        self,
        *,
        wallet_id: UUID,
        action: str,
        reason: Optional[str],
        performed_by: Optional[UUID],
    ):
        freeze_history = WalletFreezeHistory(
            wallet_id=wallet_id,
            action=action,
            reason=reason,
            performed_by=performed_by,
        )
        self.db.add(freeze_history)
        await self.db.flush()
        await self.db.refresh(freeze_history)
        return freeze_history

    async def create_audit_log(
        self,
        *,
        wallet_id: UUID,
        action: str,
        details: Optional[dict],
        performed_by: Optional[UUID],
        ip_address: Optional[str],
    ):
        audit_log = WalletAuditLog(
            wallet_id=wallet_id,
            action=action,
            details=details,
            performed_by=performed_by,
            ip_address=ip_address,
        )
        self.db.add(audit_log)
        await self.db.flush()
        return audit_log

    async def get_refund_transaction(self, refund_transaction_id: UUID):
        result = await self.db.execute(
            select(RefundTransaction).where(
                RefundTransaction.id == refund_transaction_id,
                RefundTransaction.deleted_at.is_(None),
            )
        )
        return result.scalars().first()
