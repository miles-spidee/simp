import asyncio
from app.core.database import AsyncSessionLocal
from app.models.authentication.user import User
from app.models.rbac.role import Role
from app.models.rbac.user_role import UserRole
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as db:
        stmt = select(User.email).join(UserRole, User.id == UserRole.user_id).join(Role, Role.id == UserRole.role_id).where(Role.code == "SUPER_ADMIN")
        sa_res = await db.execute(stmt)
        admins = sa_res.fetchall()
        print("Super Admins found by code:", admins)

if __name__ == "__main__":
    asyncio.run(main())
