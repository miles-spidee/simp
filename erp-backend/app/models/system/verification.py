from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.core.mixins import BaseModel

class VerificationRecord(BaseModel):
    __tablename__ = 'sys_verification_records'
    __table_args__ = {'comment': 'Records tracking external verification of certificates or documents'}

    entity_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    verifier_name: Mapped[Optional[str]] = mapped_column(String(255))
    verifier_email: Mapped[Optional[str]] = mapped_column(String(255))
    aadhaar_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verification_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(50), default="VERIFIED")
