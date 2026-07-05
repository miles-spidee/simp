from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class WalletResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    owner_type: str
    owner_id: UUID
    balance: Decimal
    currency: str
    status: str
    is_frozen: bool
    created_at: datetime
    updated_at: datetime


class WalletTransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    wallet_id: UUID
    transaction_type: str
    amount: Decimal
    balance_before: Decimal
    balance_after: Decimal
    reference_type: Optional[str] = None
    reference_id: Optional[UUID] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class WalletAdjustmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    wallet_id: UUID
    adjustment_type: str
    amount: Decimal
    reason: str
    approved_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime


class WalletRefundResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    wallet_id: UUID
    refund_amount: Decimal
    reason: Optional[str] = None
    source_transaction_id: Optional[UUID] = None
    status: str
    created_at: datetime
    updated_at: datetime


class WalletLimitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    wallet_id: UUID
    max_balance: Optional[Decimal] = None
    daily_debit_limit: Optional[Decimal] = None
    daily_credit_limit: Optional[Decimal] = None
    overdraft_allowed: bool
    overdraft_limit: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime


class WalletFreezeHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    wallet_id: UUID
    action: str
    reason: Optional[str] = None
    performed_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime


class WalletAuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    wallet_id: UUID
    action: str
    details: Optional[dict] = None
    performed_by: Optional[UUID] = None
    ip_address: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class RefundTransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    refund_request_id: UUID
    refund_amount: Decimal
    refund_method: str
    transaction_reference: Optional[str] = None
    refunded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class WalletDetailResponse(BaseModel):
    wallet: WalletResponse
    transactions: List[WalletTransactionResponse]
    adjustments: List[WalletAdjustmentResponse]
    refunds: List[WalletRefundResponse]
    limit: Optional[WalletLimitResponse] = None
    freeze_history: List[WalletFreezeHistoryResponse]
    audit_logs: List[WalletAuditLogResponse]
    current_balance: Decimal


class PaginatedWalletResponse(BaseModel):
    items: List[WalletResponse]
    total: int
    page: int
    page_size: int


class PaginatedWalletTransactionResponse(BaseModel):
    items: List[WalletTransactionResponse]
    total: int
    page: int
    page_size: int


class WalletDashboardResponse(BaseModel):
    total_system_wallet_balance: Decimal
    total_credits: Decimal
    total_debits: Decimal
    total_wallets: int
    frozen_wallets: int
    refund_balance: Decimal
    recent_transactions: List[WalletTransactionResponse]


class WalletCreditRequest(BaseModel):
    wallet_id: UUID
    amount: Decimal
    reference_type: Optional[str] = None
    reference_id: Optional[UUID] = None
    description: Optional[str] = None
    performed_by: Optional[UUID] = None
    ip_address: Optional[str] = None


class WalletDebitRequest(WalletCreditRequest):
    pass


class WalletFreezeRequest(BaseModel):
    wallet_id: UUID
    reason: Optional[str] = None
    performed_by: Optional[UUID] = None
    ip_address: Optional[str] = None


class WalletRefundRequest(BaseModel):
    wallet_id: UUID
    refund_transaction_id: UUID
    reason: Optional[str] = None
    performed_by: Optional[UUID] = None
    ip_address: Optional[str] = None


class WalletOperationResponse(BaseModel):
    wallet: WalletResponse
    transaction: Optional[WalletTransactionResponse] = None
    refund: Optional[WalletRefundResponse] = None
    freeze_history: Optional[WalletFreezeHistoryResponse] = None
