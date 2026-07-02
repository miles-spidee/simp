import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, ForeignKey, Text
from app.models.core.mixins import BaseModel

class VerificationRequest(BaseModel):
    __tablename__ = 'cert_verification_requests'
    __table_args__ = {'comment': 'Log of certificate verification requests'}

    certificate_number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    requested_by_ip: Mapped[str] = mapped_column(String(50), nullable=False)
    method: Mapped[str] = mapped_column(String(50), nullable=False)
    result: Mapped[str] = mapped_column(String(50), nullable=False)
