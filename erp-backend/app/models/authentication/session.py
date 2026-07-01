import uuid
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, ForeignKey, CheckConstraint, Date
from app.models.core.mixins import BaseModel

class Session(BaseModel):
    __tablename__ = 'auth_sessions'
    __table_args__ = (
        CheckConstraint('expires_at > login_time', name='chk_session_expiration_valid'),
        {'comment': 'Active login sessions'}
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    device_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_devices.id', ondelete='SET NULL'), index=True)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    user_agent: Mapped[str] = mapped_column(String(500), nullable=False)
    
    login_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_activity_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="sessions")
    device: Mapped[Optional["Device"]] = relationship("Device", back_populates="sessions")
    login_history: Mapped[List["LoginHistory"]] = relationship("LoginHistory", back_populates="session")
