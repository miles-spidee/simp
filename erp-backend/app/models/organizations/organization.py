from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum as SQLEnum
from app.models.core.mixins import BaseModel
from app.models.core.enums import StatusEnum

class Organization(BaseModel):
    __tablename__ = 'org_organizations'
    __table_args__ = {'comment': 'Top-level organizations or institutions'}

    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False, default="Engineering", comment="e.g., Engineering, Science, Management")
    email: Mapped[Optional[str]] = mapped_column(String(255))
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    website: Mapped[Optional[str]] = mapped_column(String(500))
    
    address_line_1: Mapped[Optional[str]] = mapped_column(String(255))
    address_line_2: Mapped[Optional[str]] = mapped_column(String(255))
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(String(100))
    country: Mapped[Optional[str]] = mapped_column(String(100))
    postal_code: Mapped[Optional[str]] = mapped_column(String(20))
    
    accreditation: Mapped[Optional[str]] = mapped_column(String(255))
    partnership_status: Mapped[str] = mapped_column(String(50), default="Active")
    nba_status: Mapped[Optional[str]] = mapped_column(String(50), default="Applied")
    autonomous_status: Mapped[Optional[str]] = mapped_column(String(50), default="Affiliated")
    naac_grade: Mapped[Optional[str]] = mapped_column(String(10))
    national_ranking: Mapped[Optional[int]] = mapped_column(nullable=True)
    establishment_year: Mapped[Optional[int]] = mapped_column(nullable=True)
    university_affiliation: Mapped[Optional[str]] = mapped_column(String(255))

    campuses: Mapped[List["Campus"]] = relationship("Campus", back_populates="organization", cascade="all, delete-orphan")
    departments: Mapped[List["Department"]] = relationship("Department", back_populates="organization", cascade="all, delete-orphan")
    coordinators: Mapped[List["OrganizationCoordinator"]] = relationship("OrganizationCoordinator", back_populates="organization", cascade="all, delete-orphan")
