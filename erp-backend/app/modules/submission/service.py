from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.submission.repository import SubmissionRepository
from app.modules.submission.schemas import SubmissionCreate, SubmissionUpdate

class SubmissionService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = SubmissionRepository(db)
        super().__init__(repo)
