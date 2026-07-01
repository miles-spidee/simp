from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.employee.repository import EmployeeRepository
from app.modules.employee.schemas import EmployeeCreate, EmployeeUpdate

class EmployeeService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = EmployeeRepository(db)
        super().__init__(repo)
