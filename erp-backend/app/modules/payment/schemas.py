from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.modules.billing.schemas import (
    InvoiceResponse,
    PaymentTransactionResponse,
    ReceiptResponse,
    RefundRequestResponse,
    RefundTransactionResponse,
)
from app.modules.wallet.schemas import WalletRefundResponse


# -------------------------
# Legacy Razorpay Requests
# -------------------------

class CreateOrderRequest(BaseModel):
    application_id: UUID


class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str


# -------------------------
# Legacy Razorpay Responses
# -------------------------

class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    status: str


class VerifyPaymentResponse(BaseModel):
    verified: bool
    payment_id: str
    order_id: str
    status: str
    amount: int
    currency: str
    invoice_number: str | None = None
    receipt_number: str | None = None


class WebhookResponse(BaseModel):
    processed: bool
    event: str
    ignored: bool | None = None


class PaymentDetailsResponse(BaseModel):
    application_id: str
    transaction: dict
    invoice: dict | None = None
    receipt: dict | None = None


# -------------------------
# Payment Collection Requests
# -------------------------

class ManualPaymentRequest(BaseModel):
    payment_method: str
    amount: Decimal
    invoice_id: UUID
    transaction_id: Optional[str] = None
    customer_email: Optional[str] = None
    customer_contact: Optional[str] = None
    customer_name: Optional[str] = None
    currency: str = "INR"
    performed_by: Optional[UUID] = None


class PaymentRefundRequest(BaseModel):
    payment_transaction_id: UUID
    amount: Decimal
    invoice_id: UUID
    requested_by: UUID
    reason: str
    reviewed_by: UUID
    refund_method: str
    transaction_reference: Optional[str] = None
    wallet_id: Optional[UUID] = None


class PaymentReminderRequest(BaseModel):
    invoice_id: UUID
    reminder_type: str
    channel: str


# -------------------------
# Payment Collection Responses
# -------------------------

class PaymentReconciliationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    payment_transaction_id: UUID
    erp_amount: Decimal
    gateway_amount: Optional[Decimal] = None
    bank_amount: Optional[Decimal] = None
    match_status: str
    reconciled_by: Optional[UUID] = None
    reconciled_at: Optional[datetime] = None
    discrepancy_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class PaymentGatewayLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    payment_transaction_id: UUID
    event_type: str
    request_payload: Optional[dict] = None
    response_payload: Optional[dict] = None
    webhook_payload: Optional[dict] = None
    http_status_code: Optional[int] = None
    is_reconciled: bool
    created_at: datetime
    updated_at: datetime


class PaymentLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    payment_transaction_id: UUID
    event: str
    details: Optional[dict] = None
    performed_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime


class PaymentDashboardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    today_collection: Decimal
    monthly_collection: Decimal
    successful_payments: int
    failed_payments: int
    pending_payments: int
    outstanding_amount: Decimal
    refund_requests: int
    success_rate: float
    recent_transactions: List[PaymentTransactionResponse]


class PaginatedPaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: List[PaymentTransactionResponse]
    total: int
    page: int
    page_size: int


class PaginatedPaymentReconciliationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: List[PaymentReconciliationResponse]
    total: int
    page: int
    page_size: int


class PaymentDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    payment_transaction: PaymentTransactionResponse
    invoice: Optional[InvoiceResponse] = None
    receipt: Optional[ReceiptResponse] = None
    gateway_logs: List[PaymentGatewayLogResponse] = []
    payment_logs: List[PaymentLogResponse] = []
    reconciliation: List[PaymentReconciliationResponse] = []
    refund_information: List[RefundRequestResponse] = []


class PaymentExportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: List[PaymentTransactionResponse]
    total: int


class PaymentRefundResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    refund_request: RefundRequestResponse
    refund_transaction: RefundTransactionResponse
    wallet_refund: Optional[WalletRefundResponse] = None


class PaymentReminderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    invoice_id: UUID
    reminder_type: str
    channel: str
    status: str