import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class ExportJob(BaseModel):
    __tablename__ = 'analytics_export_jobs'
    __table_args__ = {'comment': 'Asynchronous export job tracking'}

    module_name: Mapped[str] = mapped_column(String(255), nullable=False)
    format: Mapped[str] = mapped_column(String(50), nullable=False, comment="PDF, Excel, CSV, JSON")
    requested_by_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Pending", comment="Pending, Processing, Completed, Failed")
    file_url: Mapped[Optional[str]] = mapped_column(String(500))
