from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.mentor.repository import MentorRepository
from app.modules.mentor.schemas import MentorCreate, MentorUpdate

class MentorService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = MentorRepository(db)
        super().__init__(repo)
