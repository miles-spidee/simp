import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class EmployeeProfile(BaseModel):
    __tablename__ = 'profile_employees'
    __table_args__ = (
        UniqueConstraint('employee_code', name='uq_employee_code'),
        {'comment': 'Base profile for internal organizational staff'}
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_organizations.id', ondelete='RESTRICT'), index=True, nullable=False)
    department_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('org_departments.id', ondelete='RESTRICT'), index=True)

    employee_code: Mapped[str] = mapped_column(String(100), nullable=False)
    designation: Mapped[str] = mapped_column(String(150), nullable=False)
    date_of_joining: Mapped[Optional[date]] = mapped_column(Date)
