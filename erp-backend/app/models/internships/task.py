import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, Date
from app.models.core.mixins import BaseModel

class Task(BaseModel):
    __tablename__ = 'intern_tasks'
    __table_args__ = {'comment': 'Specific tasks assigned by a mentor to a student'}

    assignment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('intern_mentor_assignments.id', ondelete='CASCADE'), index=True, nullable=False)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    due_date: Mapped[Optional[date]] = mapped_column(Date)
    
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="TODO", comment="TODO, IN_PROGRESS, IN_REVIEW, COMPLETED")
    submission_url: Mapped[Optional[str]] = mapped_column(String(500))
    feedback: Mapped[Optional[str]] = mapped_column(Text)

    assignment: Mapped["MentorAssignment"] = relationship("MentorAssignment", back_populates="tasks")
