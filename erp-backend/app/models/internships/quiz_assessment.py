import uuid
from typing import Optional, Any
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, ForeignKey, JSON
from app.models.core.mixins import BaseModel

class QuizAssessment(BaseModel):
    __tablename__ = 'quiz_assessments'
    __table_args__ = {'comment': 'Quiz configuration and metadata'}

    batch_id: Mapped[str] = mapped_column(String(50), nullable=False)
    frontend_id: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False) # minutes
    passing_marks: Mapped[int] = mapped_column(Integer, nullable=False)
    negative_marking: Mapped[bool] = mapped_column(Boolean, default=False)
    
    security_settings: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    questions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False)

    submissions: Mapped[list["QuizSubmission"]] = relationship("QuizSubmission", back_populates="assessment", cascade="all, delete-orphan")


class QuizSubmission(BaseModel):
    __tablename__ = 'quiz_submissions'
    __table_args__ = {'comment': 'Candidate attempts for quizzes'}

    assessment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('quiz_assessments.id', ondelete='CASCADE'), index=True, nullable=False)
    student_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    student_name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    attempts: Mapped[int] = mapped_column(Integer, default=1)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)
    
    question_analysis: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)

    assessment: Mapped["QuizAssessment"] = relationship("QuizAssessment", back_populates="submissions")
