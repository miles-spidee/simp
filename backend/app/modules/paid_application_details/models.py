"""
paid_application_details/models.py

ORM model for the `paid_application_details` table.

Stores payment-specific fields captured only for PAID internship
applications. Zero-or-one per Application (enforced by UNIQUE on
application_id).

`payment_mode` maps to `payment_mode_enum` in PostgreSQL:
    'upi' | 'net_banking' | 'credit_card' | 'debit_card'

`payment_status` maps to `payment_status_enum` in PostgreSQL:
    'pending' | 'verified' | 'failed'
"""

import uuid

from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class PaidApplicationDetail(Base):
    """
    Payment details for PAID internship applications (0:1 with Application).

    Valid payment_mode values : 'upi', 'net_banking', 'credit_card', 'debit_card'
    Valid payment_status values: 'pending', 'verified', 'failed'
    """

    __tablename__ = "paid_application_details"

    paid_application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.application_id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    fee_acceptance: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    payment_mode: Mapped[str] = mapped_column(String(50), nullable=False)
    transaction_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    payment_status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending",
        server_default="pending",
        index=True,
    )
    # FK → application_documents.document_id (ON DELETE SET NULL)
    payment_document_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("application_documents.document_id", ondelete="SET NULL"),
        nullable=True,
    )

    # Relationships
    application: Mapped["Application"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "Application", back_populates="paid_details"
    )
    payment_document: Mapped["ApplicationDocument | None"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        "ApplicationDocument"
    )