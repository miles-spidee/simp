import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class Conversation(BaseModel):
    __tablename__ = 'comm_conversations'
    __table_args__ = {'comment': 'Messaging threads/conversations'}

    type: Mapped[str] = mapped_column(String(50), nullable=False, comment="DIRECT, GROUP")
    name: Mapped[Optional[str]] = mapped_column(String(255), comment="Group name if applicable")

    participants: Mapped[List["ConversationParticipant"]] = relationship("ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class ConversationParticipant(BaseModel):
    __tablename__ = 'comm_conversation_participants'
    __table_args__ = {'comment': 'Users participating in a conversation'}

    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('comm_conversations.id', ondelete='CASCADE'), index=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="participants")
