import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey, CheckConstraint, Date
from app.models.core.mixins import BaseModel

class OTP(BaseModel):
    __tablename__ = 'auth_otps'
    __table_args__ = (
        CheckConstraint('attempts >= 0', name='chk_otp_attempts_positive'),
        {'comment': 'One-Time Passwords for MFA, verification, and password resets'}
    )

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True)
    purpose: Mapped[str] = mapped_column(String(50), index=True, nullable=False) # e.g. MFA, EMAIL_VERIFY, PASSWORD_RESET
    code_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user: Mapped[Optional["User"]] = relationship("User", back_populates="otps")
