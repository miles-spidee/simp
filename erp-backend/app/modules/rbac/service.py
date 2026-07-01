from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.services.base import BaseCRUDService
from app.modules.rbac.repository import RoleRepository
from app.modules.rbac.schemas import RoleCreate, RoleUpdate, PermissionAssign
from app.models.rbac.role import Role
from app.models.rbac.role_permission import RolePermission

class RoleService(BaseCRUDService[Role, RoleCreate, RoleUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, RoleRepository())

    async def assign_permissions(self, data: PermissionAssign, user_id: UUID) -> dict:
        # Business Workflow: Assign multiple permissions to a role
        role = await self.get(data.role_id)
        
        # Clear existing
        from sqlalchemy import delete
        await self.db.execute(delete(RolePermission).where(RolePermission.role_id == data.role_id))
        
        # Insert new
        for perm_id in data.permission_ids:
            rp = RolePermission(role_id=role.id, permission_id=perm_id)
            self.db.add(rp)
            
        await self.log_audit_event("ASSIGN_PERMISSIONS", "Role", user_id, new_value={"role_id": str(role.id), "permissions": [str(pid) for pid in data.permission_ids]})
        await self.commit_transaction()
        return {"success": True}
