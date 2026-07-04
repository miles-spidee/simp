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

@router.get("/monitoring/data")
async def get_monitoring_data(role: str = "Mentor", db: AsyncSession = Depends(get_db)):
    """
    Unified endpoint to fetch DashboardStats, Assessments, and StudentAssessments
    based on the requested role.
    """
    from sqlalchemy import select
    from app.models.profiles.student_profile import StudentProfile
    from app.models.internships.mentor_assignment import MentorAssignment
    from app.models.organizations.organization import Organization
    
    svc = QuizAssessmentService(db)
    # Fetch all quizzes and submissions
    quizzes, all_submissions = await svc.get_all_quizzes()
    
    # -------------------------------------------------------------
    # 1. APPLY ROLE-BASED FILTERING
    # -------------------------------------------------------------
    submissions = []
    if role == 'Mentor':
        # Get all students assigned to ANY mentor for demo purposes (or a specific mentor in prod)
        # Here we query all MentorAssignments to get valid student user_ids
        stmt = select(StudentProfile.user_id).join(MentorAssignment, MentorAssignment.student_profile_id == StudentProfile.id)
        result = await db.execute(stmt)
        valid_student_ids = [str(uid) for uid in result.scalars().all()]
        submissions = [s for s in all_submissions if s.student_id in valid_student_ids]
    
    elif role == 'College Coordinator':
        # Get all students belonging to a college
        stmt = select(StudentProfile.user_id).join(Organization, Organization.id == StudentProfile.organization_id).where(Organization.type == 'COLLEGE')
        result = await db.execute(stmt)
        valid_student_ids = [str(uid) for uid in result.scalars().all()]
        submissions = [s for s in all_submissions if s.student_id in valid_student_ids]
        
    else: # Super Admin
        submissions = all_submissions

    # -------------------------------------------------------------
    # 2. Build StudentAssessments
    # -------------------------------------------------------------
    student_assessments = []
    for sub in submissions:
        asm = next((q for q in quizzes if q.id == sub.assessment_id), None)
        qa = sub.question_analysis or {}
        
        sa = {
            "id": str(sub.id),
            "studentId": sub.student_id,
            "assessmentId": str(sub.assessment_id),
            "studentName": sub.student_name,
            "college": qa.get("college", "Unknown College"),
            "program": qa.get("program", "Unknown Program"),
            "assessmentName": asm.title if asm else "Unknown",
            "attempt": sub.attempts,
            "score": sub.score,
            "percentage": sub.score, # Assuming score is out of 100
            "rank": 0,
            "passStatus": "Pass" if sub.passed else "Fail",
            "completionTime": qa.get("completionTime", 0),
            "status": sub.status,
            "dateCompleted": "2024-03-15T10:30:00Z", # Mock date
            "sections": qa.get("sections", []),
            "questions": qa.get("questions", [])
        }
        student_assessments.append(sa)
        
    # Sort and rank
    student_assessments.sort(key=lambda x: x["score"], reverse=True)
    for i, sa in enumerate(student_assessments):
        sa["rank"] = i + 1

    # -------------------------------------------------------------
    # 3. Build Assessments overview
    # -------------------------------------------------------------
    assessments = []
    for q in quizzes:
        q_subs = [s for s in submissions if s.assessment_id == q.id]
        if not q_subs and role != 'Super Admin':
            # Skip assessments with no relevant submissions for this role
            continue
            
        total_subs = len(q_subs)
        avg_score = sum(s.score for s in q_subs) / total_subs if total_subs > 0 else 0
        passed_subs = sum(1 for s in q_subs if s.passed)
        pass_rate = (passed_subs / total_subs * 100) if total_subs > 0 else 0
        
        assessments.append({
            "id": str(q.id),
            "name": q.title,
            "program": "Computer Science",
            "batch": q.batch_id,
            "assignedStudents": total_subs + (2 if role == 'Super Admin' else 0), # Mock
            "completedAttempts": total_subs,
            "pendingAttempts": 2 if role == 'Super Admin' else 0,
            "averageScore": round(avg_score, 1),
            "passPercentage": round(pass_rate, 1),
            "duration": q.duration,
            "status": "Active",
            "createdBy": "Admin",
            "createdDate": "2024-03-01T00:00:00Z"
        })

    # -------------------------------------------------------------
    # 4. Build Dashboard Stats (Based on filtered submissions)
    # -------------------------------------------------------------
    total_subs = len(submissions)
    avg_score = sum(s.score for s in submissions) / total_subs if total_subs > 0 else 0
    pass_rate = sum(1 for s in submissions if s.passed) / total_subs * 100 if total_subs > 0 else 0
    highest = max((s.score for s in submissions), default=0)
    lowest = min((s.score for s in submissions), default=0)
    avg_time = sum(s.question_analysis.get("completionTime", 0) for s in submissions) / total_subs if total_subs > 0 else 0

    # Ensure we return valid numbers, not ZeroDivisionError
    active_assessments = len(set(s.assessment_id for s in submissions)) if total_subs > 0 else 0

    stats = {
        "mentor": {
            "assignedStudents": len(set(s.student_id for s in submissions)),
            "activeAssessments": active_assessments,
            "completedAssessments": total_subs,
            "pendingAttempts": 0,
            "averageScore": round(avg_score, 1),
            "passRate": round(pass_rate, 1),
            "highestScore": highest,
            "lowestScore": lowest,
            "avgCompletionTime": round(avg_time, 1),
            "studentsAtRisk": sum(1 for s in submissions if not s.passed)
        },
        "coordinator": {
            "collegeStudents": len(set(s.student_id for s in submissions)),
            "activeAssessments": active_assessments,
            "completedAssessments": total_subs,
            "averageCollegeScore": round(avg_score, 1),
            "collegePassRate": round(pass_rate, 1),
            "topPerformingBatch": "Batch 2024-A",
            "weakestBatch": "Batch 2024-B",
            "studentsPending": 0,
            "highestScorer": max(submissions, key=lambda s: s.score).student_name if total_subs > 0 else "N/A",
            "lowestScorer": min(submissions, key=lambda s: s.score).student_name if total_subs > 0 else "N/A"
        },
        "admin": {
            "totalAssessments": len(quizzes),
            "totalAttempts": total_subs,
            "activeExams": active_assessments,
            "platformAverage": round(avg_score, 1),
            "overallPassRate": round(pass_rate, 1),
            "totalStudents": len(set(s.student_id for s in submissions)),
            "topPerformingCollege": "Mock University",
            "weakestCollege": "N/A",
            "highestScore": highest,
            "lowestScore": lowest
        }
    }

    return {
        "assessments": assessments,
        "studentAssessments": student_assessments,
        "dashboardStats": stats
    }

