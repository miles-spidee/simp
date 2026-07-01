from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.dashboard.repository import DashboardRepository
from app.modules.dashboard.schemas import DashboardCreate, DashboardUpdate

class DashboardService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = DashboardRepository(db)
        super().__init__(repo)
