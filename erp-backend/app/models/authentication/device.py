import uuid
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Date
from app.models.core.mixins import BaseModel

class Device(BaseModel):
    __tablename__ = 'auth_devices'
    __table_args__ = {'comment': 'Trusted devices for a user'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    device_name: Mapped[str] = mapped_column(String(255), nullable=False)
    platform: Mapped[Optional[str]] = mapped_column(String(100))
    os: Mapped[Optional[str]] = mapped_column(String(100))
    browser: Mapped[Optional[str]] = mapped_column(String(100))
    push_notification_token: Mapped[Optional[str]] = mapped_column(String(500))
    is_trusted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_seen_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship("User", back_populates="devices")
    sessions: Mapped[List["Session"]] = relationship("Session", back_populates="device", cascade="save-update, merge")
