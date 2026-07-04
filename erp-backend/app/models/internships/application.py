import uuid
from typing import Optional, List

from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB

from app.models.core.mixins import BaseModel


class Application(BaseModel):
    __tablename__ = "intern_applications"

    __table_args__ = (
        UniqueConstraint(
            "opportunity_id",
            "student_profile_id",
            name="uq_intern_application",
        ),
        {
            "comment": "Student applications to specific opportunities"
        },
    )

    opportunity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("intern_opportunities.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    student_profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profile_students.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PENDING",
    )

    feedback: Mapped[Optional[str]] = mapped_column(
        String(1000)
    )

    application_data: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True
    )

    review_data: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True
    )

    # -------------------------
    # Relationships
    # -------------------------

    opportunity: Mapped["Opportunity"] = relationship(
        "Opportunity",
        back_populates="applications",
    )

    student_profile: Mapped["StudentProfile"] = relationship(
        "StudentProfile",
        back_populates="applications",
    )

    payments: Mapped[List["PaymentTransaction"]] = relationship(
        "PaymentTransaction",
        back_populates="application",
    )