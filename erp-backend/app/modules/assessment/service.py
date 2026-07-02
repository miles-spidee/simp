from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.assessment.repository import QuizAssessmentRepository, QuizSubmissionRepository
from app.modules.assessment.schemas import QuizAssessmentCreate, QuizSubmissionCreate
import uuid

class QuizAssessmentService(BaseService):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.repo = QuizAssessmentRepository(db)
        self.submission_repo = QuizSubmissionRepository(db)

    async def create_quiz(self, data: QuizAssessmentCreate, user_id: str):
        create_data = data.model_dump()
        # Map frontend vars to db cols
        db_data = {
            "batch_id": create_data["batchId"],
            "frontend_id": f"ASM-{uuid.uuid4().hex[:6]}",
            "title": create_data["title"],
            "type": create_data["type"],
            "duration": create_data["duration"],
            "passing_marks": create_data["passingMarks"],
            "negative_marking": create_data["negativeMarking"],
            "security_settings": create_data["securitySettings"],
            "questions": create_data["questions"],
            "created_by": user_id,
            "updated_by": user_id
        }
        return await self.execute_with_integrity_check(self.repo.create(self.db, obj_in=db_data))

    async def get_all_quizzes(self):
        quizzes = await self.repo.get_all_with_submissions()
        # also fetch submissions
        submissions = await self.submission_repo.get_all()
        return quizzes, submissions

class QuizSubmissionService(BaseService):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.repo = QuizSubmissionRepository(db)

    async def create_submission(self, data: QuizSubmissionCreate, user_id: str):
        create_data = data.model_dump()
        # find assessment internal id
        asm_repo = QuizAssessmentRepository(self.db)
        quizzes = await asm_repo.get_all()
        asm = next((q for q in quizzes if q.frontend_id == create_data["asmId"]), None)
        if not asm:
            raise Exception("Assessment not found")
        
        db_data = {
            "assessment_id": asm.id,
            "student_id": create_data["studentId"],
            "student_name": create_data["studentName"],
            "attempts": create_data["attempts"],
            "score": create_data["score"],
            "status": create_data["status"],
            "passed": create_data["passed"],
            "question_analysis": create_data["questionAnalysis"],
            "created_by": user_id,
            "updated_by": user_id
        }
        return await self.execute_with_integrity_check(self.repo.create(self.db, obj_in=db_data))
