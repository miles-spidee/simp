"""
application_documents/models.py

ORM model for the `application_documents` table.

Stores uploaded file attachments (resume, payment screenshot, etc.) as
PostgreSQL BYTEA blobs. One Application can have many documents (1:M).

Document type labels (per architecture doc):
    'resume' | 'payment_screenshot' | 'other'
"""

import uuid
import datetime

from sqlalchemy import String, BigInteger, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, BYTEA
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ApplicationDocument(Base):
    """
    Binary file attachment linked to an Application.

    `file_data` stores the raw binary content via PostgreSQL BYTEA.
    `file_size` is in bytes (CHECK > 0 enforced in SQL schema).
    """

    __tablename__ = "application_documents"

    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.application_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    document_type: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    file_data: Mapped[bytes] = mapped_column(BYTEA, nullable=False)
    uploaded_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    # Relationships
    application: Mapped["Application"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application", back_populates="documents"
    )