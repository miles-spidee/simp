from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.repositories.base import BaseRepository
from app.models.internships.quiz_assessment import QuizAssessment, QuizSubmission

class QuizAssessmentRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(QuizAssessment)
        self.db = db

    async def get_all_with_submissions(self):
        result = await self.db.execute(select(QuizAssessment))
        return result.scalars().all()

    async def get_all(self):
        result = await self.db.execute(select(QuizAssessment))
        return result.scalars().all()

class QuizSubmissionRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(QuizSubmission)
        self.db = db

    async def get_all(self):
        result = await self.db.execute(select(QuizSubmission))
        return result.scalars().all()

