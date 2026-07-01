import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, ForeignKey
from app.models.core.mixins import BaseModel

class VerificationRecord(BaseModel):
    __tablename__ = 'sys_verification_records'
    __table_args__ = {'comment': 'Records tracking external verification of certificates or documents'}

    entity_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    verifier_name: Mapped[Optional[str]] = mapped_column(String(255))
    verifier_email: Mapped[Optional[str]] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(50), default="VERIFIED")
