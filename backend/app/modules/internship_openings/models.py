"""
internship_openings/models.py

ORM model for the `internship_openings` table.

Each opening is a specific role posted under an InternshipType (e.g.
"Junior AI Engineer – Paid – 12 Weeks – Fee ₹5 000").

`created_by` is an FK to `users.user_id` (ON DELETE SET NULL).
`status` maps to the PostgreSQL `opening_status_enum` ('active' | 'inactive');
stored as a plain String to keep the model portable.
"""

import uuid
import datetime
from datetime import date
from decimal import Decimal

from sqlalchemy import String, Text, Integer, Numeric, Date, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class InternshipOpening(Base):
    """
    A single internship listing shown in the UI.

    Valid status values: 'active', 'inactive' (opening_status_enum in PG).
    """

    __tablename__ = "internship_openings"

    opening_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    internship_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("internship_types.internship_type_id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    role_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    project_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    duration_weeks: Mapped[int | None] = mapped_column(Integer, nullable=True)
    stipend_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    fee_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    total_openings: Mapped[int] = mapped_column(Integer, nullable=False)
    application_deadline: Mapped[date | None] = mapped_column(
        Date, nullable=True, index=True
    )
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="active",
        server_default="active",
        index=True,
    )
    # FK -> users.user_id (ON DELETE SET NULL)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    # Relationships
    internship_type: Mapped["InternshipType"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "InternshipType", back_populates="openings"
    )
    creator: Mapped["User | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "User",
        back_populates="created_openings",
        foreign_keys=[created_by],
    )
    applications: Mapped[list["Application"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application", back_populates="opening"
    )
