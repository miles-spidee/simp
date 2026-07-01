import uuid
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, ForeignKey, DateTime, Date
from app.models.core.mixins import BaseModel

class Announcement(BaseModel):
    __tablename__ = 'comm_announcements'
    __table_args__ = {'comment': 'System-wide or targeted announcements'}

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100))
    priority: Mapped[str] = mapped_column(String(50), default="NORMAL")
    
    publish_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expiry_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="DRAFT")
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    author_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)

    audiences: Mapped[List["AnnouncementAudience"]] = relationship("AnnouncementAudience", back_populates="announcement", cascade="all, delete-orphan")

class AnnouncementAudience(BaseModel):
    __tablename__ = 'comm_announcement_audiences'
    __table_args__ = {'comment': 'Target audience filters for an announcement'}

    announcement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('comm_announcements.id', ondelete='CASCADE'), index=True, nullable=False)
    # Target by either explicit user or by role
    target_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'))
    target_role_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('rbac_roles.id', ondelete='CASCADE'))

    announcement: Mapped["Announcement"] = relationship("Announcement", back_populates="audiences")
