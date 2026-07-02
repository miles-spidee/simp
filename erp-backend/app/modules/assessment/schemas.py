from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from uuid import UUID

class QuizQuestion(BaseModel):
    text: str
    options: List[str]
    answer: str
    marks: int

class SecuritySettings(BaseModel):
    secureBrowser: bool
    disableCopy: bool
    disableRightClick: bool
    fullscreenOnly: bool
    disableTabSwitch: bool
    cameraRequired: bool
    microphoneRequired: bool

class QuizAssessmentCreate(BaseModel):
    batchId: str
    title: str
    type: str
    duration: int
    passingMarks: int
    negativeMarking: bool
    securitySettings: SecuritySettings
    questions: List[QuizQuestion]

class QuizAssessmentResponse(QuizAssessmentCreate):
    id: str

    class Config:
        from_attributes = True

class QuestionStat(BaseModel):
    question: str
    correct: bool
    skipped: bool
    marksGained: int

class QuestionAnalysis(BaseModel):
    correctCount: int
    wrongCount: int
    skippedCount: int
    negativeMarks: int
    detailed: List[QuestionStat]

class QuizSubmissionCreate(BaseModel):
    asmId: str
    studentId: str
    studentName: str
    attempts: int
    score: int
    status: str
    passed: bool
    questionAnalysis: QuestionAnalysis

class QuizSubmissionResponse(QuizSubmissionCreate):
    id: UUID

    class Config:
        from_attributes = True
