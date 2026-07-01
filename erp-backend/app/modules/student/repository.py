from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.modules.student.schemas import StudentCreate, StudentUpdate
# TODO: Import correct Model
# from app.models... import Model

class StudentRepository(BaseRepository): # Pass generic types Model, Create, Update
    def __init__(self, db: AsyncSession):
        pass # super().__init__(Model)
