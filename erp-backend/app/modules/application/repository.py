from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.modules.application.schemas import ApplicationCreate, ApplicationUpdate
from app.models.internships.application import Application


class ApplicationRepository(BaseRepository[Application, ApplicationCreate, ApplicationUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Application)
