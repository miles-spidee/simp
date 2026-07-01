from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Date, Boolean, CheckConstraint
from app.models.core.mixins import BaseModel

class AcademicYear(BaseModel):
    __tablename__ = 'acad_academic_years'
    __table_args__ = (
        CheckConstraint('end_date > start_date', name='chk_acad_year_dates'),
        {'comment': 'Global academic year definitions (e.g., 2026-2027)'}
    )

    name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    semesters: Mapped[List["Semester"]] = relationship("Semester", back_populates="academic_year", cascade="all, delete-orphan")
