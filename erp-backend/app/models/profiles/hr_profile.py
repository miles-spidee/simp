import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class HRProfile(BaseModel):
    __tablename__ = 'profile_hr'
    __table_args__ = {'comment': 'Profile for Human Resources personnel'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_organizations.id', ondelete='RESTRICT'), index=True, nullable=False)
    employee_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('profile_employees.id', ondelete='SET NULL'), unique=True, index=True)

    hr_level: Mapped[Optional[str]] = mapped_column(String(50), comment="e.g., Executive, Manager, Director")
    territory_scope: Mapped[Optional[str]] = mapped_column(String(100), comment="e.g., Global, North Campus")
