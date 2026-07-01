import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Numeric, ForeignKey
from app.models.core.mixins import BaseModel

class Lesson(BaseModel):
    __tablename__ = 'lms_lessons'
    __table_args__ = {'comment': 'Individual lessons within a course module'}

    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('lms_course_modules.id', ondelete='CASCADE'), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content_html: Mapped[Optional[str]] = mapped_column(Text)
    video_url: Mapped[Optional[str]] = mapped_column(String(500))
    order_index: Mapped[int] = mapped_column(Numeric, nullable=False, default=0)

    module: Mapped["CourseModule"] = relationship("CourseModule", back_populates="lessons")
