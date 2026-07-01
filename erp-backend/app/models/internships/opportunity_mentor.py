import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class OpportunityMentor(BaseModel):
    __tablename__ = 'intern_opportunity_mentors'
    __table_args__ = (
        UniqueConstraint('opportunity_id', 'mentor_profile_id', name='uq_intern_opportunity_mentor'),
        {'comment': 'Mentors assigned to evaluate or supervise specific opportunities'}
    )

    opportunity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('intern_opportunities.id', ondelete='CASCADE'), index=True, nullable=False)
    mentor_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_mentors.id', ondelete='CASCADE'), index=True, nullable=False)

    opportunity: Mapped["Opportunity"] = relationship("Opportunity", back_populates="assigned_mentors")
