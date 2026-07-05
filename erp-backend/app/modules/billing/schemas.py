from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class InvoiceItemBase(BaseModel):
    description: str
    amount: Decimal


class InvoiceItemCreate(InvoiceItemBase):
    pass


class InvoiceItemResponse(InvoiceItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    invoice_id: UUID
    created_at: datetime
    updated_at: datetime


class InvoiceBase(BaseModel):
    invoice_number: str
    student_profile_id: Optional[UUID] = None
    company_id: Optional[UUID] = None
    sub_total: Decimal
    tax_amount: Decimal = Decimal("0")
    discount: Decimal = Decimal("0")
    grand_total: Decimal
    payment_status: str = "UNPAID"
    issue_date: date
    due_date: date


class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]


class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = None
    student_profile_id: Optional[UUID] = None
    company_id: Optional[UUID] = None
    sub_total: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    discount: Optional[Decimal] = None
    grand_total: Optional[Decimal] = None
    payment_status: Optional[str] = None
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    items: Optional[List[InvoiceItemCreate]] = None


class InvoiceResponse(InvoiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemResponse] = []


class ReceiptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    receipt_number: str
    invoice_id: Optional[UUID] = None
    amount_paid: Decimal
    payment_method: str
    payment_date: datetime
    transaction_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class PaymentTransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    transaction_id: str
    user_id: Optional[UUID] = None
    order_id: Optional[UUID] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    amount: Decimal
    currency_id: Optional[UUID] = None
    currency: str
    status: str
    payment_method: Optional[str] = None
    receipt: Optional[str] = None
    customer_email: Optional[str] = None
    customer_contact: Optional[str] = None
    customer_name: Optional[str] = None
    razorpay_created_at: Optional[datetime] = None
    refund: bool
    gateway_response: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class BillingTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    template_type: str
    content: Optional[str] = None
    is_default: bool
    created_at: datetime
    updated_at: datetime


class InvoiceReminderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    invoice_id: UUID
    reminder_type: str
    sent_at: Optional[datetime] = None
    channel: str
    status: str
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


class RefundRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    invoice_id: UUID
    requested_by: Optional[UUID] = None
    amount: Decimal
    reason: Optional[str] = None
    status: str
    reviewed_by: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    refund_transaction: Optional[RefundTransactionResponse] = None


class InvoiceDetailResponse(BaseModel):
    invoice: InvoiceResponse
    receipt: Optional[ReceiptResponse] = None
    payment_status: str
    payment_transaction: Optional[PaymentTransactionResponse] = None
    reminder_history: List[InvoiceReminderResponse] = []
    refund_requests: List[RefundRequestResponse] = []


class PaginatedInvoiceResponse(BaseModel):
    items: List[InvoiceResponse]
    total: int
    page: int
    page_size: int


class PaginatedReceiptResponse(BaseModel):
    items: List[ReceiptResponse]
    total: int
    page: int
    page_size: int


class PaginatedPaymentStatusResponse(BaseModel):
    items: List[PaymentTransactionResponse]
    total: int
    page: int
    page_size: int


class BillingDashboardResponse(BaseModel):
    total_invoices: int
    paid_invoices: int
    unpaid_invoices: int
    overdue_invoices: int
    refunded_invoices: int
    total_revenue: Decimal
    outstanding_amount: Decimal
    recent_invoices: List[InvoiceResponse]
