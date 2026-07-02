import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from app.models.core.mixins import BaseModel

class EmailTemplate(BaseModel):
    __tablename__ = 'comm_email_templates'
    __table_args__ = {'comment': 'System email templates'}

    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100))
    subject: Mapped[str] = mapped_column(String(500), nullable=False)
    html_body: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default='Active', server_default='Active')
    variables: Mapped[Optional[list]] = mapped_column(JSONB, comment="List of dynamic placeholders")

class EmailHistory(BaseModel):
    __tablename__ = 'comm_email_history'
    __table_args__ = {'comment': 'Log of sent emails'}

    template_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('comm_email_templates.id', ondelete='SET NULL'), index=True)
    recipient_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, comment="Delivered, Bounced, Opened")
