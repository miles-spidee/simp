import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Numeric, CheckConstraint
from app.models.core.mixins import BaseModel

class Assessment(BaseModel):
    __tablename__ = 'intern_assessments'
    __table_args__ = (
        CheckConstraint('score >= 0 AND score <= max_score', name='chk_intern_assessment_score'),
        {'comment': 'Performance assessments conducted by mentors'}
    )

    assignment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('intern_mentor_assignments.id', ondelete='CASCADE'), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    
    score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    max_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    feedback: Mapped[Optional[str]] = mapped_column(String(1000))

    assignment: Mapped["MentorAssignment"] = relationship("MentorAssignment", back_populates="assessments")
