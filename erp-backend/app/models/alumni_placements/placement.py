import uuid
from typing import Optional, List
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, Numeric, Date, DateTime
from app.models.core.mixins import BaseModel

class PlacementDrive(BaseModel):
    __tablename__ = 'alum_placement_drives'
    __table_args__ = {'comment': 'Placement drives organized with companies'}

    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('comp_companies.id', ondelete='CASCADE'), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    drive_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="SCHEDULED")

class PlacementApplication(BaseModel):
    __tablename__ = 'alum_placement_applications'
    __table_args__ = {'comment': 'Applications submitted during placement drives'}

    placement_drive_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('alum_placement_drives.id', ondelete='CASCADE'), index=True, nullable=False)
    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="APPLIED")

class OfferLetter(BaseModel):
    __tablename__ = 'alum_offer_letters'
    __table_args__ = {'comment': 'Job offers made to students'}

    placement_application_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('alum_placement_applications.id', ondelete='CASCADE'), index=True, nullable=False)
    ctc: Mapped[float] = mapped_column(Numeric(15, 2))
    joining_date: Mapped[Optional[date]] = mapped_column(Date)
    file_url: Mapped[Optional[str]] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(50), default="ISSUED")

class Interview(BaseModel):
    __tablename__ = 'alum_interviews'
    __table_args__ = {'comment': 'Interviews scheduled during placements'}

    placement_application_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('alum_placement_applications.id', ondelete='CASCADE'), index=True, nullable=False)
    round_name: Mapped[str] = mapped_column(String(100), nullable=False)
    scheduled_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="SCHEDULED")

class InterviewFeedback(BaseModel):
    __tablename__ = 'alum_interview_feedback'
    __table_args__ = {'comment': 'Feedback from interviews'}

    interview_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('alum_interviews.id', ondelete='CASCADE'), index=True, nullable=False)
    recruiter_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_recruiters.id', ondelete='CASCADE'), index=True, nullable=False)
    rating: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    comments: Mapped[Optional[str]] = mapped_column(Text)


class PlacementOpportunity(BaseModel):
    __tablename__ = 'alum_placement_opportunities'
    __table_args__ = {'comment': 'Corporate job placement opportunities'}

    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('comp_companies.id', ondelete='CASCADE'), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    package_lpa: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    tier: Mapped[str] = mapped_column(String(50), default="MID")  # TOP, MID, SMALL
    requirements: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="OPEN")  # OPEN, CLOSED

