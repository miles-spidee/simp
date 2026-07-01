import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Numeric, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class Course(BaseModel):
    __tablename__ = 'acad_courses'
    __table_args__ = (
        UniqueConstraint('program_id', 'code', name='uq_acad_course_code'),
        {'comment': 'Specific courses or subjects within a program'}
    )

    program_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('acad_programs.id', ondelete='CASCADE'), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    credits: Mapped[Optional[int]] = mapped_column(Integer)
    description: Mapped[Optional[str]] = mapped_column(String(1000))

    program: Mapped["Program"] = relationship("Program", back_populates="courses")
