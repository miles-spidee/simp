import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, ForeignKey, Date
from app.models.core.mixins import BaseModel

class LoginHistory(BaseModel):
    __tablename__ = 'auth_login_history'
    __table_args__ = {'comment': 'Audit log of user login attempts and sessions'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    session_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_sessions.id', ondelete='SET NULL'), index=True)
    
    login_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    logout_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    country: Mapped[Optional[str]] = mapped_column(String(100))
    city: Mapped[Optional[str]] = mapped_column(String(100))
    
    browser: Mapped[Optional[str]] = mapped_column(String(100))
    operating_system: Mapped[Optional[str]] = mapped_column(String(100))
    platform: Mapped[Optional[str]] = mapped_column(String(100))
    
    result: Mapped[str] = mapped_column(String(50), nullable=False) # SUCCESS, FAILURE
    failure_reason: Mapped[Optional[str]] = mapped_column(String(255))

    user: Mapped["User"] = relationship("User", back_populates="login_history")
    session: Mapped[Optional["Session"]] = relationship("Session", back_populates="login_history")
