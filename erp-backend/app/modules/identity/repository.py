from __future__ import annotations
from typing import Any
from uuid import UUID
from sqlalchemy import select, text
import time
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
        
    async def get_by_email_or_username(self, db: AsyncSession, identifier: str) -> User | None:
        result = await db.execute(select(User).filter((User.email == identifier) | (User.username == identifier)))
        return result.scalars().first()

    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

_perm_cache = {}
CACHE_TTL = 300 # 5 minutes

class PermissionRepository:
    def __init__(self, db: AsyncSession):
        pass
        
    async def user_has_permission(self, db: AsyncSession, user_id: UUID, permission_name: str) -> bool:
        """
        Check if a user has a specific permission code (e.g. 'students:read')
        via their assigned roles, using a single optimized SQL query and memory cache.
        """
        cache_key = f"{user_id}:{permission_name}"
        now = time.time()
        
        # Check cache
        if cache_key in _perm_cache and (now - _perm_cache[cache_key]['time']) < CACHE_TTL:
            return _perm_cache[cache_key]['result']

        module_code = permission_name.split(".")[0] if "." in permission_name else ""

        # Single combined query
        stmt = text("""
            SELECT EXISTS (
                SELECT 1 FROM rbac_user_roles ur 
                JOIN rbac_roles r ON ur.role_id = r.id 
                WHERE ur.user_id = :user_id AND r.code = 'SUPER_ADMIN'
            ) OR EXISTS (
                SELECT 1 FROM rbac_user_roles ur 
                JOIN rbac_role_permissions rp ON ur.role_id = rp.role_id 
                JOIN rbac_permissions p ON rp.permission_id = p.id 
                WHERE ur.user_id = :user_id AND p.code = :permission_name
            ) OR EXISTS (
                SELECT 1 FROM rbac_user_modules um 
                JOIN rbac_modules m ON um.module_id = m.id 
                WHERE um.user_id = :user_id AND m.code = :module_code
            )
        """)
        
        # We must bind user_id as string because raw SQL doesn't auto-cast UUID objects natively in asyncpg unless typed
        result = await db.execute(stmt, {
            "user_id": str(user_id), 
            "permission_name": permission_name, 
            "module_code": module_code
        })
        has_perm = result.scalar() or False
        
        # Save to cache
        _perm_cache[cache_key] = {'time': now, 'result': has_perm}
        return has_perm
