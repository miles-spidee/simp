import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, ForeignKey
from app.models.core.mixins import BaseModel

class ActivityLog(BaseModel):
    __tablename__ = 'sys_activity_logs'
    __table_args__ = {'comment': 'System-wide comprehensive audit logging'}

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='SET NULL'), index=True)
    module_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    device: Mapped[Optional[str]] = mapped_column(String(255))
    browser: Mapped[Optional[str]] = mapped_column(String(255))
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    status: Mapped[str] = mapped_column(String(50), default="SUCCESS", comment="SUCCESS, FAILED, WARNING")
    severity: Mapped[str] = mapped_column(String(50), default="INFO", comment="INFO, LOW, MEDIUM, HIGH, CRITICAL")
