"""
stipend_application_details/models.py

ORM model for the `stipend_application_details` table.

Stores the single extra field captured only for STIPEND internship
applications. Zero-or-one per Application.

Note: `relevant_experience` is NOT NULL in the SQL schema (schema.sql §3.2).
"""

import uuid

from sqlalchemy import Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class StipendApplicationDetail(Base):
    """Extra details for STIPEND internship applications (0:1 with Application)."""

    __tablename__ = "stipend_application_details"

    stipend_application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.application_id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    # NOT NULL per SQL schema §3.2
    relevant_experience: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    application: Mapped["Application"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application", back_populates="stipend_details"
    )