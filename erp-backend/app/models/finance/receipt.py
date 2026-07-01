import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Numeric, DateTime, ForeignKey, Date
from app.models.core.mixins import BaseModel

class Receipt(BaseModel):
    __tablename__ = 'fin_receipts'
    __table_args__ = {'comment': 'Payment receipts'}

    receipt_number: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    invoice_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('fin_invoices.id', ondelete='SET NULL'), index=True)
    
    amount_paid: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)
    payment_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    transaction_id: Mapped[Optional[str]] = mapped_column(String(255), index=True)
