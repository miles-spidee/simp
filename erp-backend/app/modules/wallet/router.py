from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Query

from app.core.database import DBSession
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
    WalletResponse,
)
from app.modules.wallet.service import WalletService

router = APIRouter()


@router.get("/dashboard", response_model=WalletDashboardResponse)
async def get_wallet_dashboard(db: DBSession):
    return await WalletService(db).get_dashboard()


@router.get("/list", response_model=PaginatedWalletResponse)
async def get_wallets(
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    owner_type: Optional[str] = None,
    wallet_status: Optional[str] = None,
    is_frozen: Optional[bool] = None,
    organization_id: Optional[UUID] = None,
    program_id: Optional[UUID] = None,
):
    return await WalletService(db).get_wallets(
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        owner_type=owner_type,
        wallet_status=wallet_status,
        is_frozen=is_frozen,
        organization_id=organization_id,
    )


@router.get("/transactions", response_model=PaginatedWalletTransactionResponse)
async def get_wallet_transactions(
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    wallet_id: Optional[UUID] = None,
    transaction_type: Optional[str] = None,
    reference_type: Optional[str] = None,
):
    return await WalletService(db).get_transactions(
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        wallet_id=wallet_id,
        transaction_type=transaction_type,
        reference_type=reference_type,
    )


@router.get("/export", response_model=list[WalletResponse])
async def export_wallets(db: DBSession):
    return await WalletService(db).export_wallets()


@router.get("/{wallet_id}", response_model=WalletDetailResponse)
async def get_wallet(wallet_id: UUID, db: DBSession):
    return await WalletService(db).get_wallet_detail(wallet_id)


@router.post("/credit", response_model=WalletOperationResponse)
async def credit_wallet(data: WalletCreditRequest, db: DBSession):
    return await WalletService(db).credit_wallet(data)


@router.post("/debit", response_model=WalletOperationResponse)
async def debit_wallet(data: WalletDebitRequest, db: DBSession):
    return await WalletService(db).debit_wallet(data)


@router.post("/freeze", response_model=WalletOperationResponse)
async def freeze_wallet(data: WalletFreezeRequest, db: DBSession):
    return await WalletService(db).freeze_wallet(data)


@router.post("/unfreeze", response_model=WalletOperationResponse)
async def unfreeze_wallet(data: WalletFreezeRequest, db: DBSession):
    return await WalletService(db).unfreeze_wallet(data)


@router.post("/refund", response_model=WalletOperationResponse)
async def refund_wallet(data: WalletRefundRequest, db: DBSession):
    return await WalletService(db).refund_wallet(data)
