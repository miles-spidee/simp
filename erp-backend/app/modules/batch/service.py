from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.batch.repository import BatchRepository
from app.modules.batch.schemas import BatchCreate, BatchUpdate

class BatchService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = BatchRepository(db)
        super().__init__(repo)
