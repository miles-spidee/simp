from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.task.repository import TaskRepository
from app.modules.task.schemas import TaskCreate, TaskUpdate

class TaskService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = TaskRepository(db)
        super().__init__(repo)
