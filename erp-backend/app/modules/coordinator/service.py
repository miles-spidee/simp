from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.coordinator.repository import CoordinatorRepository
from app.modules.coordinator.schemas import CoordinatorCreate, CoordinatorUpdate

class CoordinatorService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = CoordinatorRepository(db)
        super().__init__(repo)
