from typing import Any
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.authentication.user import User
from app.models.rbac.user_role import UserRole
from app.models.rbac.role_permission import RolePermission
from app.models.rbac.permission import Permission
from pydantic import BaseModel as PydanticBaseModel

# We'll create real schemas later, using PydanticBaseModel for now to satisfy type constraints
class UserCreate(PydanticBaseModel):
    pass

class UserUpdate(PydanticBaseModel):
    pass

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(User)
        
    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

class PermissionRepository:
    def __init__(self, db: AsyncSession):
        pass
        
    async def user_has_permission(self, db: AsyncSession, user_id: UUID, permission_name: str) -> bool:
        """
        Check if a user has a specific permission code (e.g. 'students:read')
        via their assigned roles.
        """
        # Check if user has SUPER_ADMIN role first
        from app.models.rbac.role import Role
        super_admin_stmt = (
            select(Role)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == user_id)
            .where(Role.code == 'SUPER_ADMIN')
        )
        super_admin_role = await db.execute(super_admin_stmt)
        if super_admin_role.scalars().first():
            return True

        # Check specific permission code (e.g. 'students:read')
        stmt = (
            select(Permission)
            .join(RolePermission, RolePermission.permission_id == Permission.id)
            .join(UserRole, UserRole.role_id == RolePermission.role_id)
            .where(UserRole.user_id == user_id)
            .where(Permission.code == permission_name)
        )
        result = await db.execute(stmt)
        return result.scalars().first() is not None
