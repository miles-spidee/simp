"""
industrial_application_details/models.py

ORM model for the `industrial_application_details` table.

Stores the extra fields captured only for INDUSTRIAL internship
applications. Zero-or-one per Application.

Both columns are NOT NULL per SQL schema §3.3.
"""

import uuid

from sqlalchemy import Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class IndustrialApplicationDetail(Base):
    """Extra details for INDUSTRIAL internship applications (0:1 with Application)."""

    __tablename__ = "industrial_application_details"

    industrial_application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.application_id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    # NOT NULL per SQL schema §3.3
    preferred_technology_stack: Mapped[str] = mapped_column(Text, nullable=False)
    # NOT NULL per SQL schema §3.3
    relevant_technical_experience: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    application: Mapped["Application"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application", back_populates="industrial_details"
    )
