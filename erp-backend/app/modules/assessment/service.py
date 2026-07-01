from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.assessment.repository import AssessmentRepository
from app.modules.assessment.schemas import AssessmentCreate, AssessmentUpdate

class AssessmentService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = AssessmentRepository(db)
        super().__init__(repo)
