import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from app.models.core.mixins import BaseModel
from app.models.authentication.user import User
from typing import List

class StudentProfile(BaseModel):
    __tablename__ = 'profile_students'
    __table_args__ = (
        UniqueConstraint('enrollment_number', name='uq_student_enrollment_number'),
        {'comment': 'Profile data specifically for students and interns'}
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_organizations.id', ondelete='RESTRICT'), index=True, nullable=False)
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('org_departments.id', ondelete='RESTRICT'), index=True)
    batch_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('acad_batches.id', ondelete='RESTRICT'), index=True)

    enrollment_number: Mapped[str] = mapped_column(String(100), nullable=False)
    resume_url: Mapped[Optional[str]] = mapped_column(String(500))
    github_url: Mapped[Optional[str]] = mapped_column(String(500))
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(500))
    
    # Unstructured skills data, or migrate to a junction table later if queryability is required
    skills: Mapped[Optional[dict]] = mapped_column(JSONB)
    user: Mapped["User"] = relationship("User")

    applications: Mapped[List["Application"]] = relationship(
        "Application",
        back_populates="student_profile",
        cascade="all, delete-orphan",
    )