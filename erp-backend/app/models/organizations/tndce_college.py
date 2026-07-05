import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.models.core.mixins import BaseModel

class TNDCECollege(BaseModel):
    __tablename__ = 'ref_tndce_colleges'
    __table_args__ = {'comment': 'Master list of official colleges from Tamil Nadu TNDCE'}

    college_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    district: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    region: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    college_type: Mapped[str] = mapped_column(String(100), index=True, nullable=False) # e.g., Government, Aided, Self-Financing
