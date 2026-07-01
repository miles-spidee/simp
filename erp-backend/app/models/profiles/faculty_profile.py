import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class FacultyProfile(BaseModel):
    __tablename__ = 'profile_faculty'
    __table_args__ = {'comment': 'Profile for academic instructors'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_departments.id', ondelete='RESTRICT'), index=True, nullable=False)
    employee_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('profile_employees.id', ondelete='SET NULL'), unique=True, index=True)

    academic_title: Mapped[Optional[str]] = mapped_column(String(50), comment="e.g., Prof., Dr., Mr.")
    specialization: Mapped[Optional[str]] = mapped_column(String(255))
