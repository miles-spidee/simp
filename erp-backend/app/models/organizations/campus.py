import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class Campus(BaseModel):
    __tablename__ = 'org_campuses'
    __table_args__ = {'comment': 'Physical campuses or branches belonging to an organization'}

    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_organizations.id', ondelete='CASCADE'), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    address_line1: Mapped[Optional[str]] = mapped_column(String(255))
    address_line2: Mapped[Optional[str]] = mapped_column(String(255))
    
    city_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_cities.id', ondelete='RESTRICT'))
    state_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_states.id', ondelete='RESTRICT'))
    country_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('ref_countries.id', ondelete='RESTRICT'))

    organization: Mapped["Organization"] = relationship("Organization", back_populates="campuses")
    # Note: City, State, Country relationships can be loaded via references if needed
