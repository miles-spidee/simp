from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.application.repository import ApplicationRepository
from app.modules.application.schemas import ApplicationCreate, ApplicationUpdate

class ApplicationService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = ApplicationRepository(db)
        super().__init__(repo)
