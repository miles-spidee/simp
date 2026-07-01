import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Numeric, ForeignKey
from app.models.core.mixins import BaseModel

class CourseModule(BaseModel):
    __tablename__ = 'lms_course_modules'
    __table_args__ = {'comment': 'Modules inside a course curriculum'}

    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('acad_courses.id', ondelete='CASCADE'), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    order_index: Mapped[int] = mapped_column(Numeric, nullable=False, default=0)

    lessons: Mapped[List["Lesson"]] = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")
    quizzes: Mapped[List["Quiz"]] = relationship("Quiz", back_populates="module", cascade="all, delete-orphan")
