import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class Program(BaseModel):
    __tablename__ = 'acad_programs'
    __table_args__ = (
        UniqueConstraint('department_id', 'code', name='uq_acad_program_code'),
        {'comment': 'Academic or Training Programs (e.g., B.Tech CS, Full Stack Bootcamp)'}
    )

    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('org_departments.id', ondelete='RESTRICT'), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000))
    duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
    program_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="e.g., Degree, Certification, Bootcamp")

    department: Mapped["Department"] = relationship("Department", back_populates="programs")
    courses: Mapped[List["Course"]] = relationship("Course", back_populates="program", cascade="all, delete-orphan")
    semesters: Mapped[List["Semester"]] = relationship("Semester", back_populates="program", cascade="all, delete-orphan")
    batches: Mapped[List["Batch"]] = relationship("Batch", back_populates="program", cascade="all, delete-orphan")
