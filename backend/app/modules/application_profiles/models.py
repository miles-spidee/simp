"""
application_profiles/models.py

ORM model for the `application_profiles` table.

Stores the full personal / academic / professional snapshot submitted
with an application. One-to-one with the `applications` table
(enforced by UNIQUE on application_id).
"""

import uuid
from datetime import date
from decimal import Decimal

from sqlalchemy import String, Text, SmallInteger, Numeric, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ApplicationProfile(Base):
    """
    Complete applicant profile snapshot (1:1 with Application).

    Columns mirror application_profiles in database/schema.sql §2.5.
    """

    __tablename__ = "application_profiles"

    application_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.application_id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # ── Personal Information ──────────────────────────────────────────────────
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    mobile_number: Mapped[str] = mapped_column(String(20), nullable=False)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)

    # ── Academic Information ──────────────────────────────────────────────────
    college_name: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    department: Mapped[str] = mapped_column(String(150), nullable=False)
    degree: Mapped[str] = mapped_column(String(100), nullable=False)
    # Valid range: 1–7 (enforced by CHECK in SQL schema)
    current_year: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    # CGPA (0–10) or percentage (0–100); CHECK in SQL schema
    cgpa_percentage: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    graduation_year: Mapped[int] = mapped_column(SmallInteger, nullable=False)

    # ── Professional Information ──────────────────────────────────────────────
    skills: Mapped[str] = mapped_column(Text, nullable=False)
    github_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    portfolio_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    project_experience: Mapped[str | None] = mapped_column(Text, nullable=True)

    # ── Motivation ────────────────────────────────────────────────────────────
    motivation_statement: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    application: Mapped["Application"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application", back_populates="profile"
    )