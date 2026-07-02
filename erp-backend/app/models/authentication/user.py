from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey, CheckConstraint, Date
from app.models.core.mixins import BaseModel
from app.models.core.enums.status import StatusEnum

if TYPE_CHECKING:
    from app.models.files.models import CommonFile

class User(BaseModel):
    __tablename__ = 'auth_users'
    __table_args__ = (
        CheckConstraint('failed_login_attempts >= 0', name='chk_failed_login_attempts_positive'),
        {'comment': 'Central master identity table for all users (Students, Employees, Mentors)'}
    )

    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    
    account_status: Mapped[str] = mapped_column(String(50), default=StatusEnum.PENDING.value, index=True, nullable=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), index=True)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    account_locked_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    password_changed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    profile_image_url: Mapped[Optional[str]] = mapped_column(String(500))
    
    # Relationships
    sessions: Mapped[List["Session"]] = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    devices: Mapped[List["Device"]] = relationship("Device", back_populates="user", cascade="all, delete-orphan")
    otps: Mapped[List["OTP"]] = relationship("OTP", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    login_history: Mapped[List["LoginHistory"]] = relationship("LoginHistory", back_populates="user", cascade="all, delete-orphan")
    preference: Mapped[Optional["UserPreference"]] = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    payment_transactions: Mapped[List["PaymentTransaction"]] = relationship("PaymentTransaction", back_populates="user")
    
    # Common Files relationships
    uploaded_files: Mapped[List["CommonFile"]] = relationship(
        "CommonFile",
        foreign_keys="[CommonFile.uploaded_by]",
        back_populates="uploaded_by_user"
    )
    approved_files: Mapped[List["CommonFile"]] = relationship(
        "CommonFile",
        foreign_keys="[CommonFile.approved_by]",
        back_populates="approved_by_user"
    )
