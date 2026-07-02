import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class Department(BaseModel):
    __tablename__ = 'org_departments'
    __table_args__ = (
        UniqueConstraint('organization_id', 'code', name='uq_org_department_code'),
        {'comment': 'Departments within an organization'}
    )
    

    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_organizations.id', ondelete='CASCADE'), index=True, nullable=False)
    campus_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('org_campuses.id', ondelete='RESTRICT'), index=True)
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Optional denormalized stats for fast frontend loading
    hod_name: Mapped[Optional[str]] = mapped_column(String(255))
    students_count: Mapped[int] = mapped_column(default=0)
    faculty_count: Mapped[int] = mapped_column(default=0)
    internships_count: Mapped[int] = mapped_column(default=0)
    placement_rate: Mapped[float] = mapped_column(default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="Active")
    
    hod_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='SET NULL'), comment="Head of Department")

    organization: Mapped["Organization"] = relationship("Organization", back_populates="departments")
    campus: Mapped[Optional["Campus"]] = relationship("Campus")
    
    # We will declare relationship to Program in academic/program.py via back_populates
    programs: Mapped[List["Program"]] = relationship("Program", back_populates="department", cascade="all, delete-orphan")
