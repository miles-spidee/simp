import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from app.models.core.mixins import BaseModel

class OrganizationCoordinatorProfile(BaseModel):
    __tablename__ = 'profile_org_coordinators'
    __table_args__ = {'comment': 'Profile for organization-level coordinators (e.g., Placement Officers)'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_organizations.id', ondelete='CASCADE'), index=True, nullable=False)
    employee_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('profile_employees.id', ondelete='SET NULL'), unique=True, index=True)

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    is_primary_contact: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
