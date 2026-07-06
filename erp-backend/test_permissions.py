import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.authentication.role import Role
from app.models.authentication.permission import Permission
from app.models.authentication.role_permission import RolePermission

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Role).where(Role.code == 'COLLEGE_COORDINATOR'))
        role = res.scalars().first()
        if not role:
            print("Role not found")
            return
        
        stmt = (
            select(Permission)
            .join(RolePermission, RolePermission.permission_id == Permission.id)
            .where(RolePermission.role_id == role.id)
        )
        res = await db.execute(stmt)
        permissions = res.scalars().all()
        for p in permissions:
            print(f"{p.module}:{p.action}")

asyncio.run(main())
