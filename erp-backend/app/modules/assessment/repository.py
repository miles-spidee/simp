from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.repositories.base import BaseRepository
from app.models.internships.quiz_assessment import QuizAssessment, QuizSubmission
from app.core.security_filters import apply_program_scoped_filter
from app.models.authentication.user import User
from typing import Optional

class QuizAssessmentRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(QuizAssessment)
        self.db = db

    async def get_all_with_submissions(self, current_user: Optional[User] = None):
        stmt = select(QuizAssessment)
        if current_user:
            stmt = await apply_program_scoped_filter(stmt, self.db, current_user, QuizAssessment)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_all(self, current_user: Optional[User] = None):
        stmt = select(QuizAssessment)
        if current_user:
            stmt = await apply_program_scoped_filter(stmt, self.db, current_user, QuizAssessment)
        result = await self.db.execute(stmt)
        return result.scalars().all()

class QuizSubmissionRepository(BaseRepository):
    def __init__(self, db: AsyncSession):
        super().__init__(QuizSubmission)
        self.db = db

    async def get_all(self, current_user: Optional[User] = None):
        stmt = select(QuizSubmission)
        if current_user:
            stmt = await apply_rls_filter(stmt, self.db, current_user, QuizSubmission)
        result = await self.db.execute(stmt)
        return result.scalars().all()

