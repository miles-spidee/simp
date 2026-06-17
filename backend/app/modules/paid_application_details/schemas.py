from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class PaidApplicationDetailsCreate(BaseModel):
    application_id: UUID
    fee_acceptance: bool
    payment_mode: str
    transaction_id: str
    payment_status: str
    payment_document_id: Optional[UUID] = None


class PaidApplicationDetailsUpdate(BaseModel):
    fee_acceptance: Optional[bool] = None
    payment_mode: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_status: Optional[str] = None
    payment_document_id: Optional[UUID] = None


class PaidApplicationDetailsResponse(BaseModel):
    paid_application_id: UUID
    application_id: UUID
    fee_acceptance: bool
    payment_mode: str
    transaction_id: str
    payment_status: str
    payment_document_id: Optional[UUID]

    class Config:
        from_attributes = True