import uuid
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, DateTime, Date
from app.models.core.mixins import BaseModel

class Message(BaseModel):
    __tablename__ = 'comm_messages'
    __table_args__ = {'comment': 'Individual messages within a conversation'}

    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('comm_conversations.id', ondelete='CASCADE'), index=True, nullable=False)
    sender_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    
    content: Mapped[str] = mapped_column(Text, nullable=False)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="SENT")

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")
