import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Date, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from app.models.core.mixins import BaseModel

class Allocation(BaseModel):
    __tablename__ = 'core_allocations'
    __table_args__ = (
        CheckConstraint('end_date IS NULL OR end_date > start_date', name='chk_core_allocation_dates'),
        {'comment': 'Generic table for all allocations (e.g. Student->Program, Mentor->Program, Program->Batch)'}
    )

    source_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    
    target_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    
    role: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    
    start_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="ACTIVE")
