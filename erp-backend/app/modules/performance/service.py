from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.performance.repository import PerformanceRepository
from app.modules.performance.schemas import PerformanceCreate, PerformanceUpdate

class PerformanceService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = PerformanceRepository(db)
        super().__init__(repo)
