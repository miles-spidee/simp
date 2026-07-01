import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, ForeignKey
from app.models.core.mixins import BaseModel

class MentorProfile(BaseModel):
    __tablename__ = 'profile_mentors'
    __table_args__ = {'comment': 'Profile for project and internship mentors'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    # Optional link to EmployeeProfile if the mentor is internal staff
    employee_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('profile_employees.id', ondelete='SET NULL'), unique=True, index=True)

    expertise: Mapped[Optional[str]] = mapped_column(String(255))
    years_of_experience: Mapped[Optional[int]] = mapped_column(Integer)
    max_capacity: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
