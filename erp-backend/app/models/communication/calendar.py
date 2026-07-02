import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from app.models.core.mixins import BaseModel

class CalendarEvent(BaseModel):
    __tablename__ = 'comm_calendar_events'
    __table_args__ = {'comment': 'Calendar scheduling events'}

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    start_time: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    meeting_link: Mapped[Optional[str]] = mapped_column(String(500))
    participants: Mapped[Optional[list]] = mapped_column(JSONB)
    status: Mapped[str] = mapped_column(String(50), default='Scheduled')
