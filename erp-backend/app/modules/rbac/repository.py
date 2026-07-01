from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.repositories.base import BaseRepository
from app.models.rbac.role import Role
from app.modules.rbac.schemas import RoleCreate, RoleUpdate

class RoleRepository(BaseRepository[Role, RoleCreate, RoleUpdate]):
    def __init__(self):
        super().__init__(Role, search_fields=["name", "code"])
        
    async def get_by_code(self, db: AsyncSession, code: str) -> Role | None:
        result = await db.execute(select(Role).filter(Role.code == code))
        return result.scalars().first()
