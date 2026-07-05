import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.rbac.role import Role
from app.models.rbac.role_permission import RolePermission
from app.models.rbac.permission import Permission

async def main():
    async with AsyncSessionLocal() as db:
        role_stmt = select(Role).where(Role.name == 'HR')
        role = (await db.execute(role_stmt)).scalars().first()
        if not role:
            print("HR role not found")
            return
        
        rp_stmt = select(RolePermission).where(RolePermission.role_id == role.id)
        rps = (await db.execute(rp_stmt)).scalars().all()
        
        perm_ids = [rp.permission_id for rp in rps]
        p_stmt = select(Permission).where(Permission.id.in_(perm_ids))
        perms = (await db.execute(p_stmt)).scalars().all()
        
        for p in perms:
            print(p.name)

if __name__ == "__main__":
    asyncio.run(main())
