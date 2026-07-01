import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey
from app.models.core.mixins import BaseModel

class Ticket(BaseModel):
    __tablename__ = 'sup_tickets'
    __table_args__ = {'comment': 'Support and helpdesk tickets'}

    requester_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    assigned_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='SET NULL'), index=True)
    
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    priority: Mapped[str] = mapped_column(String(50), default="NORMAL")
    status: Mapped[str] = mapped_column(String(50), default="OPEN")

    messages: Mapped[List["TicketMessage"]] = relationship("TicketMessage", back_populates="ticket", cascade="all, delete-orphan")

class TicketMessage(BaseModel):
    __tablename__ = 'sup_ticket_messages'
    __table_args__ = {'comment': 'Conversation history on a ticket'}

    ticket_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('sup_tickets.id', ondelete='CASCADE'), index=True, nullable=False)
    sender_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="messages")

class FAQ(BaseModel):
    __tablename__ = 'sup_faqs'
    __table_args__ = {'comment': 'Frequently Asked Questions'}

    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100))
