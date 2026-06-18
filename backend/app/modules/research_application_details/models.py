"""
research_application_details/models.py

ORM model for the `research_application_details` table.

Stores the extra fields captured only for RESEARCH internship applications.
Zero-or-one per Application.

`research_area_of_interest`, `research_interest_statement`, and
`publications_available` are NOT NULL per SQL schema §3.5.
`publication_links` is nullable (only required when publications_available = TRUE).
"""

import uuid

from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ResearchApplicationDetail(Base):
    """Extra details for RESEARCH internship applications (0:1 with Application)."""

    __tablename__ = "research_application_details"

    research_application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.application_id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    # NOT NULL per SQL schema §3.5
    research_area_of_interest: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    # NOT NULL per SQL schema §3.5
    research_interest_statement: Mapped[str] = mapped_column(Text, nullable=False)
    # NOT NULL, default FALSE per SQL schema §3.5
    publications_available: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    # Nullable — only required when publications_available = TRUE
    publication_links: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    application: Mapped["Application"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application", back_populates="research_details"
    )