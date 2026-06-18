"""
applications/models.py

ORM model for the `applications` table.

Core record linking an applicant (User) to a specific InternshipOpening.
Enforces a unique constraint so one applicant can apply only once per opening.

`application_status` maps to `application_status_enum` in PostgreSQL:
    'draft' | 'submitted' | 'under_review' | 'shortlisted' |
    'accepted' | 'rejected' | 'withdrawn'

Both `applicant_user_id` and `reviewed_by` are FK → users.user_id.
Because Application references the same parent table (users) twice,
all relationship() calls include explicit foreign_keys= to disambiguate.
"""

import uuid
import datetime

from sqlalchemy import String, Text, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Application(Base):
    """
    Core application-tracking record.

    Valid application_status values:
        draft, submitted, under_review, shortlisted, accepted, rejected, withdrawn
    """

    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint(
            "opening_id",
            "applicant_user_id",
            name="uq_application_unique",
        ),
    )

    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    opening_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("internship_openings.opening_id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    # FK -> users.user_id (ON DELETE RESTRICT)
    applicant_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    application_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="draft",
        server_default="draft",
        index=True,
    )
    applied_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    reviewed_at: Mapped[datetime.datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
    # FK -> users.user_id (ON DELETE SET NULL)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    opening: Mapped["InternshipOpening"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "InternshipOpening", back_populates="applications"
    )
    applicant: Mapped["User"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "User",
        back_populates="applications_submitted",
        foreign_keys=[applicant_user_id],
    )
    reviewer: Mapped["User | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "User",
        back_populates="applications_reviewed",
        foreign_keys=[reviewed_by],
    )
    profile: Mapped["ApplicationProfile | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "ApplicationProfile", back_populates="application", uselist=False
    )
    documents: Mapped[list["ApplicationDocument"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "ApplicationDocument", back_populates="application"
    )
    paid_details: Mapped["PaidApplicationDetail | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "PaidApplicationDetail", back_populates="application", uselist=False
    )
    stipend_details: Mapped["StipendApplicationDetail | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "StipendApplicationDetail", back_populates="application", uselist=False
    )
    industrial_details: Mapped["IndustrialApplicationDetail | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "IndustrialApplicationDetail", back_populates="application", uselist=False
    )
    research_details: Mapped["ResearchApplicationDetail | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "ResearchApplicationDetail", back_populates="application", uselist=False
    )