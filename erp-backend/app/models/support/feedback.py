import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, Numeric
from app.models.core.mixins import BaseModel

class FeedbackSession(BaseModel):
    __tablename__ = 'sup_feedback_sessions'
    __table_args__ = {'comment': 'Feedback campaigns or sessions'}

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE")

    responses: Mapped[List["FeedbackResponse"]] = relationship("FeedbackResponse", back_populates="session", cascade="all, delete-orphan")

class FeedbackResponse(BaseModel):
    __tablename__ = 'sup_feedback_responses'
    __table_args__ = {'comment': 'Responses collected from a feedback session'}

    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('sup_feedback_sessions.id', ondelete='CASCADE'), index=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    
    rating: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    comments: Mapped[Optional[str]] = mapped_column(Text)

    session: Mapped["FeedbackSession"] = relationship("FeedbackSession", back_populates="responses")
