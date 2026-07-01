from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.attendance.repository import AttendanceRepository
from app.modules.attendance.schemas import AttendanceCreate, AttendanceUpdate

class AttendanceService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = AttendanceRepository(db)
        super().__init__(repo)
