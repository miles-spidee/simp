import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, ForeignKey, CheckConstraint, Date
from app.models.core.mixins import BaseModel

class RefreshToken(BaseModel):
    __tablename__ = 'auth_refresh_tokens'
    __table_args__ = (
        {'comment': 'Secure storage for refresh tokens'}
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    replaced_by_token: Mapped[Optional[str]] = mapped_column(String(255))

    user: Mapped["User"] = relationship("User", back_populates="refresh_tokens")
