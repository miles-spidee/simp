import uuid
from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Numeric, Boolean, Date
from app.models.core.mixins import BaseModel

class AlumniProfile(BaseModel):
    __tablename__ = 'alum_profiles'
    __table_args__ = {'comment': 'Alumni tracking and profiles'}

    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    graduation_year: Mapped[int] = mapped_column(Numeric, nullable=False)
    current_company: Mapped[Optional[str]] = mapped_column(String(255))
    current_designation: Mapped[Optional[str]] = mapped_column(String(255))
    
    is_mentoring: Mapped[bool] = mapped_column(Boolean, default=False)
    referrals_provided: Mapped[int] = mapped_column(Numeric, default=0)

    career_history: Mapped[List["CareerProgress"]] = relationship("CareerProgress", back_populates="alumni", cascade="all, delete-orphan")

class CareerProgress(BaseModel):
    __tablename__ = 'alum_career_progress'
    __table_args__ = {'comment': 'Career progression history for alumni'}

    alumni_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('alum_profiles.id', ondelete='CASCADE'), index=True, nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    designation: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False)

    alumni: Mapped["AlumniProfile"] = relationship("AlumniProfile", back_populates="career_history")
