import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from app.models.core.mixins import BaseModel

class RecruiterProfile(BaseModel):
    __tablename__ = 'profile_recruiters'
    __table_args__ = {'comment': 'Profile data for external company contacts/recruiters'}

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False)
    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('comp_companies.id', ondelete='CASCADE'), index=True, nullable=False)

    designation: Mapped[Optional[str]] = mapped_column(String(100))
    is_primary_contact: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    company: Mapped["Company"] = relationship("Company", back_populates="recruiters")
