import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey, Text
from app.models.core.mixins import BaseModel

class Company(BaseModel):
    __tablename__ = 'comp_companies'
    __table_args__ = {'comment': 'External companies offering internships and placements'}

    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    industry: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    website: Mapped[Optional[str]] = mapped_column(String(500))
    logo_url: Mapped[Optional[str]] = mapped_column(String(500))
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    address_line1: Mapped[Optional[str]] = mapped_column(String(255))
    address_line2: Mapped[Optional[str]] = mapped_column(String(255))
    city_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_cities.id', ondelete='RESTRICT'))
    state_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_states.id', ondelete='RESTRICT'))
    country_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_countries.id', ondelete='RESTRICT'))
    postal_code: Mapped[Optional[str]] = mapped_column(String(20))

    # We will relate RecruiterProfile to Company
    recruiters: Mapped[List["RecruiterProfile"]] = relationship("RecruiterProfile", back_populates="company", cascade="all, delete-orphan")
