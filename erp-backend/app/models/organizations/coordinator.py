import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Integer
from app.models.core.mixins import BaseModel

class OrganizationCoordinator(BaseModel):
    __tablename__ = 'org_coordinators'
    __table_args__ = {'comment': 'Coordinators associated with organizations'}

    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_organizations.id', ondelete='CASCADE'), index=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    department: Mapped[Optional[str]] = mapped_column(String(100))
    
    status: Mapped[str] = mapped_column(String(50), default="Active")
    
    students_managed: Mapped[int] = mapped_column(Integer, default=0)
    programs_managed: Mapped[int] = mapped_column(Integer, default=0)
    
    # KPI Tracking
    applications_processed: Mapped[int] = mapped_column(Integer, default=0)
    attendance_approvals: Mapped[int] = mapped_column(Integer, default=0)
    internship_completions: Mapped[int] = mapped_column(Integer, default=0)
    placement_success_rate: Mapped[float] = mapped_column(default=0.0)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="coordinators")
