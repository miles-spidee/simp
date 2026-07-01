from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.modules.program.schemas import ProgramCreate, ProgramUpdate
# TODO: Import correct Model
# from app.models... import Model

class ProgramRepository(BaseRepository): # Pass generic types Model, Create, Update
    def __init__(self, db: AsyncSession):
        pass # super().__init__(Model)
