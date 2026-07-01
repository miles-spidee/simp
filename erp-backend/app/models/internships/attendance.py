import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint, Date
from app.models.core.mixins import BaseModel

class Attendance(BaseModel):
    __tablename__ = 'intern_attendance'
    __table_args__ = (
        UniqueConstraint('student_profile_id', 'date', name='uq_intern_attendance_date'),
        {'comment': 'Daily attendance tracking for students'}
    )

    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, comment="PRESENT, ABSENT, HALF_DAY, LEAVE")
    notes: Mapped[Optional[str]] = mapped_column(String(500))
