from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.student.repository import StudentRepository
from app.modules.student.schemas import StudentCreate, StudentUpdate

class StudentService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = StudentRepository(db)
        super().__init__(repo)
