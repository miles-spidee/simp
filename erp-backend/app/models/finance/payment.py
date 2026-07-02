import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.core.mixins import BaseModel

class PaymentTransaction(BaseModel):
    __tablename__ = 'fin_payment_transactions'
    __table_args__ = (
        Index('ix_fin_payment_transactions_status', 'status'),
        Index('ix_fin_payment_transactions_created_at', 'created_at'),
        {'comment': 'Detailed log of Razorpay payment records'}
    )

    transaction_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='RESTRICT'), index=True)
    order_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('intern_applications.id', ondelete='RESTRICT'), index=True, unique=True)

    razorpay_order_id: Mapped[Optional[str]] = mapped_column(String(255), index=True, unique=True)
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(String(255), index=True, unique=True)
    razorpay_signature: Mapped[Optional[str]] = mapped_column(String(255))

    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    currency_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_currencies.id', ondelete='RESTRICT'), index=True)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, comment="created, authorized, captured, failed, refunded")
    payment_method: Mapped[Optional[str]] = mapped_column(String(50))
    receipt: Mapped[Optional[str]] = mapped_column(String(255))
    customer_email: Mapped[Optional[str]] = mapped_column(String(255), index=True)
    customer_contact: Mapped[Optional[str]] = mapped_column(String(50), index=True)
    customer_name: Mapped[Optional[str]] = mapped_column(String(255))
    notes: Mapped[Optional[dict]] = mapped_column(JSONB)
    razorpay_created_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    refund: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    gateway_response: Mapped[Optional[str]] = mapped_column(Text)

    user: Mapped[Optional["User"]] = relationship("User", back_populates="payment_transactions")
    application: Mapped[Optional["Application"]] = relationship("Application", back_populates="payments")
