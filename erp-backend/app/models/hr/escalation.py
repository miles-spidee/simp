import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, DateTime, ForeignKey, Numeric, Date
from sqlalchemy.dialects.postgresql import JSONB
from app.models.core.mixins import BaseModel

class EscalationRule(BaseModel):
    __tablename__ = 'hr_escalation_rules'
    __table_args__ = {'comment': 'Rules for automatic issue escalation'}

    type: Mapped[str] = mapped_column(String(100), nullable=False)
    condition: Mapped[str] = mapped_column(String(255), nullable=False)
    trigger_days: Mapped[int] = mapped_column(Numeric, nullable=False)
    notify_role_ids: Mapped[Optional[dict]] = mapped_column(JSONB, comment="List of role IDs to notify")
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE")

class EscalationLog(BaseModel):
    __tablename__ = 'hr_escalation_logs'
    __table_args__ = {'comment': 'Audit log of triggered escalations'}

    rule_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('hr_escalation_rules.id', ondelete='CASCADE'), index=True, nullable=False)
    target_id: Mapped[str] = mapped_column(String(255), nullable=False, comment="Polymorphic ID of the escalated entity")
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    triggered_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING")
