from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.super_admin.repository import Super_adminRepository
from app.modules.super_admin.schemas import Super_adminCreate, Super_adminUpdate

class Super_adminService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = Super_adminRepository(db)
        super().__init__(repo)
