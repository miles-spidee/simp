from sqlalchemy.ext.asyncio import AsyncSession

from app.models.academic.program import Program
from app.modules.program.repository import ProgramRepository
from app.modules.program.schemas import ProgramCreate, ProgramUpdate
from app.services.base import BaseCRUDService


class ProgramService(BaseCRUDService[Program, ProgramCreate, ProgramUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, ProgramRepository())
