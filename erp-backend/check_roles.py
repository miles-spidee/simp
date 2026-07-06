import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.rbac.role import Role
from app.models.rbac.role_permission import RolePermission
from app.models.rbac.permission import Permission
from app.models.rbac.feature import Feature
from app.models.rbac.module import Module
from app.models.authentication.user import User
from app.models.rbac.user_role import UserRole

async def check():
    async with AsyncSessionLocal() as db:
        roles = await db.execute(select(Role))
        for role in roles.scalars().all():
            perms = await db.execute(
                select(Feature.module_id)
                .select_from(RolePermission)
                .join(Permission, RolePermission.permission_id == Permission.id)
                .join(Feature, Permission.feature_id == Feature.id)
                .where(RolePermission.role_id == role.id)
            )
            mods = set(perms.scalars().all())
            print(f"Role: {role.code}, Name: {role.name}, Modules: {len(mods)}")
            
        # check user Anish
        users = await db.execute(select(User).where(User.username == 'Anish'))
        for u in users.scalars().all():
            ur = await db.execute(select(UserRole).where(UserRole.user_id == u.id))
            role_ids = ur.scalars().all()
            print(f"User: {u.username}, Role IDs: {[r.role_id for r in role_ids]}")

asyncio.run(check())
