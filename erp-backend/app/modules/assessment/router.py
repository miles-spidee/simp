from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.assessment.service import QuizAssessmentService, QuizSubmissionService
from app.modules.assessment.schemas import QuizAssessmentCreate, QuizSubmissionCreate
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/_init_db")
async def init_db():
    from app.core.database import engine
    from sqlalchemy import text
    import uuid
    async with engine.begin() as conn:
        await conn.execute(text('''
            CREATE TABLE IF NOT EXISTS quiz_assessments (
                id UUID PRIMARY KEY,
                batch_id VARCHAR(50) NOT NULL,
                frontend_id VARCHAR(50) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                duration INTEGER NOT NULL,
                passing_marks INTEGER NOT NULL,
                negative_marking BOOLEAN DEFAULT FALSE,
                security_settings JSON NOT NULL,
                questions JSON NOT NULL,
                created_by VARCHAR(255),
                updated_by VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE,
                updated_at TIMESTAMP WITH TIME ZONE,
                deleted_at TIMESTAMP WITH TIME ZONE,
                version_id INTEGER NOT NULL DEFAULT 1
            );
        '''))
        await conn.execute(text('''
            CREATE TABLE IF NOT EXISTS quiz_submissions (
                id UUID PRIMARY KEY,
                assessment_id UUID NOT NULL REFERENCES quiz_assessments(id),
                student_id VARCHAR(50) NOT NULL,
                student_name VARCHAR(255) NOT NULL,
                attempts INTEGER NOT NULL,
                score INTEGER NOT NULL,
                status VARCHAR(50) NOT NULL,
                passed BOOLEAN DEFAULT FALSE,
                question_analysis JSON NOT NULL,
                created_by VARCHAR(255),
                updated_by VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE,
                updated_at TIMESTAMP WITH TIME ZONE,
                deleted_at TIMESTAMP WITH TIME ZONE,
                version_id INTEGER NOT NULL DEFAULT 1
            );
        '''))
    return {"status": "ok"}

@router.post("/_add_version_id")
async def add_version_id():
    from app.core.database import engine
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.execute(text('ALTER TABLE quiz_assessments ADD COLUMN IF NOT EXISTS version_id INTEGER NOT NULL DEFAULT 1;'))
        await conn.execute(text('ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS version_id INTEGER NOT NULL DEFAULT 1;'))
    return {"status": "ok"}

@router.get("/quizzes")
async def get_assessment_list(db: AsyncSession = Depends(get_db)):
    svc = QuizAssessmentService(db)
    quizzes, submissions = await svc.get_all_quizzes()
    
    # Map back to frontend expected structure
    result = []
    for q in quizzes:
        q_subs = [s for s in submissions if s.assessment_id == q.id]
        
        import json
        sec_settings = q.security_settings
        if isinstance(sec_settings, str):
            sec_settings = json.loads(sec_settings)
            
        questions = q.questions
        if isinstance(questions, str):
            questions = json.loads(questions)

        mapped = {
            "id": q.frontend_id,
            "title": q.title,
            "type": q.type,
            "duration": q.duration,
            "passingMarks": q.passing_marks,
            "negativeMarking": q.negative_marking,
            "securitySettings": sec_settings,
            "questions": questions,
            "attempts": [
                {
                    "studentId": s.student_id,
                    "studentName": s.student_name,
                    "attempts": s.attempts,
                    "score": s.score,
                    "status": s.status,
                    "passed": s.passed,
                    "questionAnalysis": s.question_analysis
                } for s in q_subs
            ]
        }
        result.append(mapped)
    
    total_submissions = sum(len(q["attempts"]) for q in result)
    total_score = sum(sum(att["score"] for att in q["attempts"]) for q in result)
    avg_score = round(total_score / total_submissions) if total_submissions > 0 else 0

    # Return inside batches for the dashboard
    return [{
        "id": "batch-ai-2026",
        "name": "AI Batch 2026",
        "assessmentsCount": len(result),
        "completedCount": f"{total_submissions}",
        "averageScore": avg_score,
        "assessments": result
    }]

@router.post("/quizzes")
async def create_assessment(data: QuizAssessmentCreate, request: Request, db: AsyncSession = Depends(get_db)):
    user_id = None
    svc = QuizAssessmentService(db)
    return await svc.create_quiz(data, user_id)

@router.post("/submissions")
async def create_submission(data: QuizSubmissionCreate, request: Request, db: AsyncSession = Depends(get_db)):
    user_id = None
    svc = QuizSubmissionService(db)
    return await svc.create_submission(data, user_id)
