import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.rbac.module import Module
from app.models.rbac.feature import Feature
from app.models.rbac.permission import Permission
from app.models.rbac.role_permission import RolePermission
from app.models.rbac.role import Role

async def check():
    async with AsyncSessionLocal() as db:
        modules = await db.execute(select(Module))
        features = await db.execute(select(Feature))
        perms = await db.execute(select(Permission))
        r_perms = await db.execute(select(RolePermission))
        roles = await db.execute(select(Role))
        print("Modules:", len(modules.scalars().all()))
        print("Features:", len(features.scalars().all()))
        print("Permissions:", len(perms.scalars().all()))
        print("RolePermissions:", len(r_perms.scalars().all()))
        print("Roles:", len(roles.scalars().all()))

asyncio.run(check())
