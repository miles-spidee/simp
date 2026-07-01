import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Date, ForeignKey, Numeric
from app.models.core.mixins import BaseModel

class PerformanceReview(BaseModel):
    __tablename__ = 'hr_performance_reviews'
    __table_args__ = {'comment': 'Performance assessments for employees'}

    employee_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_employees.id', ondelete='CASCADE'), index=True, nullable=False)
    reviewer_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    review_date: Mapped[date] = mapped_column(Date, nullable=False)
    rating: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    feedback: Mapped[Optional[str]] = mapped_column(Text)

class Goal(BaseModel):
    __tablename__ = 'hr_goals'
    __table_args__ = {'comment': 'Performance goals for employees'}

    employee_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_employees.id', ondelete='CASCADE'), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE")
