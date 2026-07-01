import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from app.models.core.mixins import BaseModel

class UserPreference(BaseModel):
    __tablename__ = 'auth_user_preferences'
    __table_args__ = {'comment': 'User specific UI and system preferences'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    language_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_languages.id', ondelete='SET NULL'))
    timezone_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_timezones.id', ondelete='SET NULL'))
    theme: Mapped[str] = mapped_column(String(50), default='system')
    
    # Allow JSONB for strictly unstructured user metadata like dashboard layout
    notification_preferences: Mapped[dict] = mapped_column(JSONB, nullable=True)
    accessibility_settings: Mapped[dict] = mapped_column(JSONB, nullable=True)
    dashboard_layout: Mapped[dict] = mapped_column(JSONB, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="preference")
