from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.files.models import CommonFile
from app.modules.files.schemas import FilesCreate, FilesUpdate

class FilesRepository(BaseRepository[CommonFile, FilesCreate, FilesUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(CommonFile, search_fields=["file_name", "display_name", "description"])
