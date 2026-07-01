import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint, Date
from app.models.core.mixins import BaseModel

class Certificate(BaseModel):
    __tablename__ = 'intern_certificates'
    __table_args__ = (
        UniqueConstraint('certificate_number', name='uq_intern_certificate_number'),
        {'comment': 'Final completion certificates issued to students'}
    )

    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    assignment_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('intern_mentor_assignments.id', ondelete='SET NULL'))
    
    certificate_number: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
