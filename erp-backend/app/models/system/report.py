import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from app.models.core.mixins import BaseModel

class ReportRecord(BaseModel):
    __tablename__ = 'sys_reports'
    __table_args__ = {'comment': 'Generated report logs and metadata'}

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    generated_by: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Processing")
    format: Mapped[str] = mapped_column(String(20), default="PDF")
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    download_url: Mapped[Optional[str]] = mapped_column(String(500))
