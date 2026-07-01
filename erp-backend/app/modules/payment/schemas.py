from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel


# -------------------------
# Requests
# -------------------------

class CreateOrderRequest(BaseModel):
    application_id: UUID


class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str


# -------------------------
# Responses
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