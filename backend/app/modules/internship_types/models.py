"""
internship_types/models.py

ORM model for the `internship_types` table.

This is the master lookup / catalogue table for internship categories.
Seed values (per architecture doc): FREE, PAID, STIPEND, INDUSTRIAL,
CORPORATE, RESEARCH.
"""

import uuid
import datetime

from sqlalchemy import String, Text, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class InternshipType(Base):
    """
    Master lookup table for internship categories.

    One InternshipType can have many InternshipOpenings.
    """

    __tablename__ = "internship_types"

    internship_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    type_code: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True
    )
    type_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default="true", index=True
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    # Relationships
    openings: Mapped[list["InternshipOpening"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "InternshipOpening", back_populates="internship_type"
    )
