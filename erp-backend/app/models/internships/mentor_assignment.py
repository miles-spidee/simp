import uuid
from typing import Optional, List, TYPE_CHECKING
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint, CheckConstraint, Date
from app.models.core.mixins import BaseModel

if TYPE_CHECKING:
    from app.models.profiles.student_profile import StudentProfile
    from app.models.profiles.mentor_profile import MentorProfile
    from app.models.internships.task import Task
    from app.models.internships.assessment import Assessment

class MentorAssignment(BaseModel):
    __tablename__ = 'intern_mentor_assignments'
    __table_args__ = (
        CheckConstraint('end_date > start_date', name='chk_intern_assignment_dates'),
        UniqueConstraint('student_profile_id', 'mentor_profile_id', name='uq_intern_mentor_assignment'),
        {'comment': 'Maps a student to a specific mentor for supervision'}
    )

    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    mentor_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_mentors.id', ondelete='CASCADE'), index=True, nullable=False)
    opportunity_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('intern_opportunities.id', ondelete='SET NULL'), index=True)

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="ACTIVE", comment="ACTIVE, COMPLETED, TERMINATED")
    
    student_profile: Mapped["StudentProfile"] = relationship("StudentProfile", foreign_keys=[student_profile_id])
    mentor_profile: Mapped["MentorProfile"] = relationship("MentorProfile", foreign_keys=[mentor_profile_id])
    tasks: Mapped[List["Task"]] = relationship("Task", back_populates="assignment", cascade="all, delete-orphan")
    assessments: Mapped[List["Assessment"]] = relationship("Assessment", back_populates="assignment", cascade="all, delete-orphan")
