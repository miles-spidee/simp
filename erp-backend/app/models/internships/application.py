import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class Application(BaseModel):
    __tablename__ = 'intern_applications'
    __table_args__ = (
        UniqueConstraint('opportunity_id', 'student_profile_id', name='uq_intern_application'),
        {'comment': 'Student applications to specific opportunities'}
    )

    opportunity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('intern_opportunities.id', ondelete='CASCADE'), index=True, nullable=False)
    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PENDING", comment="PENDING, UNDER_REVIEW, ACCEPTED, REJECTED")
    feedback: Mapped[Optional[str]] = mapped_column(String(1000))

    opportunity: Mapped["Opportunity"] = relationship("Opportunity", back_populates="applications")
