import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric, ForeignKey
from app.models.core.mixins import BaseModel

class PaymentTransaction(BaseModel):
    __tablename__ = 'fin_payment_transactions'
    __table_args__ = {'comment': 'Detailed log of payment gateway transactions'}

    transaction_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    currency_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('ref_currencies.id', ondelete='RESTRICT'))
    status: Mapped[str] = mapped_column(String(50), nullable=False, comment="SUCCESS, FAILED, PENDING")
    gateway_response: Mapped[Optional[str]] = mapped_column(String(1000))
