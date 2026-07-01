import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class DepartmentCoordinatorProfile(BaseModel):
    __tablename__ = 'profile_dept_coordinators'
    __table_args__ = {'comment': 'Profile for department-level coordinators (e.g., Branch Coordinators)'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_departments.id', ondelete='CASCADE'), index=True, nullable=False)
    employee_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('profile_employees.id', ondelete='SET NULL'), unique=True, index=True)

    responsibility_scope: Mapped[Optional[str]] = mapped_column(String(255), comment="e.g., Final Year Internships, Labs")
