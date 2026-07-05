import uuid
from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Text, ForeignKey, Numeric, Date
from app.models.core.mixins import BaseModel

class Opportunity(BaseModel):
    __tablename__ = 'intern_opportunities'
    __table_args__ = {'comment': 'Internship and placement opportunities posted by companies'}

    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('comp_companies.id', ondelete='CASCADE'), index=True, nullable=False)
    program_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('acad_programs.id', ondelete='SET NULL'), index=True, nullable=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    stipend: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))
    fee: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))
    duration_weeks: Mapped[Optional[int]] = mapped_column(Integer)
    requirements: Mapped[Optional[str]] = mapped_column(Text)
    
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="OPEN", comment="OPEN, CLOSED, DRAFT")
    deadline: Mapped[Optional[date]] = mapped_column(Date)

    # Relationships
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="opportunity", cascade="all, delete-orphan")
    assigned_mentors: Mapped[List["OpportunityMentor"]] = relationship("OpportunityMentor", back_populates="opportunity", cascade="all, delete-orphan")
