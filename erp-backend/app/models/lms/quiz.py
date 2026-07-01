import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Numeric, ForeignKey
from app.models.core.mixins import BaseModel

class Quiz(BaseModel):
    __tablename__ = 'lms_quizzes'
    __table_args__ = {'comment': 'Quizzes for course modules'}

    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('lms_course_modules.id', ondelete='CASCADE'), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    max_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    passing_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    module: Mapped["CourseModule"] = relationship("CourseModule", back_populates="quizzes")
    attempts: Mapped[List["QuizAttempt"]] = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

class QuizAttempt(BaseModel):
    __tablename__ = 'lms_quiz_attempts'
    __table_args__ = {'comment': 'Student attempts on a quiz'}

    quiz_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('lms_quizzes.id', ondelete='CASCADE'), index=True, nullable=False)
    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, comment="PASSED, FAILED")

    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="attempts")
