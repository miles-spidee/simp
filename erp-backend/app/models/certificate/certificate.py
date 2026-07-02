import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, ForeignKey, Text
from app.models.core.mixins import BaseModel

class Certificate(BaseModel):
    __tablename__ = 'cert_certificates'
    __table_args__ = {'comment': 'Student certificates'}

    certificate_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    student_id: Mapped[str] = mapped_column(String(100), nullable=False)
    student_name: Mapped[str] = mapped_column(String(255), nullable=False)
    program: Mapped[str] = mapped_column(String(255), nullable=False)
    batch: Mapped[str] = mapped_column(String(100), nullable=False)
    mentor_name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    issue_date: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True))
    expiry_date: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    generated_by: Mapped[str] = mapped_column(String(100), nullable=False)
    approved_by: Mapped[Optional[str]] = mapped_column(String(100))
    qr_code_url: Mapped[str] = mapped_column(String(500), nullable=False)
    verification_url: Mapped[str] = mapped_column(String(500), nullable=False)
    digital_signature_id: Mapped[Optional[str]] = mapped_column(String(255))
