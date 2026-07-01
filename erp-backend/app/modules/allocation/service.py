from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.allocation.repository import AllocationRepository
from app.modules.allocation.schemas import AllocationCreate, AllocationUpdate

class AllocationService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = AllocationRepository(db)
        super().__init__(repo)
