from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.files.repository import FilesRepository
from app.modules.files.schemas import FilesCreate, FilesUpdate

class FilesService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = FilesRepository(db)
        super().__init__(repo)
