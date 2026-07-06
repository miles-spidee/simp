import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date, Integer, ForeignKey, CheckConstraint, UniqueConstraint
from app.models.core.mixins import BaseModel

class Batch(BaseModel):
    __tablename__ = 'acad_batches'
    __table_args__ = (
        CheckConstraint('end_date > start_date', name='chk_acad_batch_dates'),
        CheckConstraint('max_capacity > 0', name='chk_acad_batch_capacity'),
        UniqueConstraint('program_id', 'code', name='uq_acad_batch_code'),
        {'comment': 'Specific running cohorts of a program'}
    )

    program_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('acad_programs.id', ondelete='CASCADE'), index=True, nullable=False)
    semester_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('acad_semesters.id', ondelete='RESTRICT'), index=True)
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(100), nullable=False, comment="e.g., AI-JUN-2026-B1")
    
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    max_capacity: Mapped[int] = mapped_column(Integer, nullable=False)



    program: Mapped["Program"] = relationship("Program", back_populates="batches")
    semester: Mapped[Optional["Semester"]] = relationship("Semester", back_populates="batches")
