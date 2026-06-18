"""
auth/models.py

ORM model for the `users` table.

Columns mirror the PostgreSQL schema defined in database/schema.sql §2.1.
The `role` column uses a plain String instead of a native PG ENUM so that
the model remains portable and migration-friendly; the DB-level enum
`user_role_enum` is enforced by the schema DDL.
"""

import uuid
import datetime

from sqlalchemy import String, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    """
    Central user registry for applicants, reviewers, and admins.

    Valid role values (per schema): 'applicant', 'reviewer', 'admin'.
    """

    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(
        String(255), nullable=False, unique=True, index=True
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="applicant", server_default="applicant"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default="true"
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    # Relationships
    created_openings: Mapped[list["InternshipOpening"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "InternshipOpening",
        back_populates="creator",
        foreign_keys="InternshipOpening.created_by",
    )
    applications_submitted: Mapped[list["Application"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application",
        back_populates="applicant",
        foreign_keys="Application.applicant_user_id",
    )
    applications_reviewed: Mapped[list["Application"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application",
        back_populates="reviewer",
        foreign_keys="Application.reviewed_by",
    )