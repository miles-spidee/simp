import uuid
from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date, ForeignKey, CheckConstraint, UniqueConstraint
from app.models.core.mixins import BaseModel

class Semester(BaseModel):
    __tablename__ = 'acad_semesters'
    __table_args__ = (
        CheckConstraint('end_date > start_date', name='chk_acad_semester_dates'),
        UniqueConstraint('program_id', 'academic_year_id', 'name', name='uq_acad_semester_name'),
        {'comment': 'Semesters or Terms within a Program and Academic Year'}
    )

    program_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('acad_programs.id', ondelete='CASCADE'), index=True, nullable=False)
    academic_year_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('acad_academic_years.id', ondelete='RESTRICT'), index=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="e.g., Fall 2026, Semester 1")
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)

    program: Mapped["Program"] = relationship("Program", back_populates="semesters")
    academic_year: Mapped["AcademicYear"] = relationship("AcademicYear", back_populates="semesters")
    batches: Mapped[List["Batch"]] = relationship("Batch", back_populates="semester")
