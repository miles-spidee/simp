from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.lms.repository import LmsRepository
from app.modules.lms.schemas import LmsCreate, LmsUpdate

class LmsService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = LmsRepository(db)
        super().__init__(repo)
