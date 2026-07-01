from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.modules.super_admin.schemas import Super_adminCreate, Super_adminUpdate
# TODO: Import correct Model
# from app.models... import Model

class Super_adminRepository(BaseRepository): # Pass generic types Model, Create, Update
    def __init__(self, db: AsyncSession):
        pass # super().__init__(Model)
