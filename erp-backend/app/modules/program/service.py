from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.program.repository import ProgramRepository
from app.modules.program.schemas import ProgramCreate, ProgramUpdate

class ProgramService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = ProgramRepository(db)
        super().__init__(repo)
