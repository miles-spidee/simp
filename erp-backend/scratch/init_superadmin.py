import asyncio
from app.core.database import AsyncSessionLocal
from app.models.authentication.user import User
from app.models.rbac.role import Role
from app.models.rbac.user_role import UserRole
from app.core.security import hash_password
from sqlalchemy import select
from datetime import datetime

async def main():
    async with AsyncSessionLocal() as db:
        stmt = select(User.email, Role.name).join(UserRole, User.id == UserRole.user_id).join(Role, Role.id == UserRole.role_id).where(Role.name == "SUPER_ADMIN")
        sa_res = await db.execute(stmt)
        admins = sa_res.fetchall()
        print("Super Admins found:", admins)

        if not admins:
            print("No SUPER_ADMIN found. Creating one...")
            # Let's see if SUPER_ADMIN role exists
            role_res = await db.execute(select(Role).where(Role.name == "SUPER_ADMIN"))
            sa_role = role_res.scalar_one_or_none()
            if not sa_role:
                sa_role = Role(name="SUPER_ADMIN", code="SUPER_ADMIN", description="Super Administrator")
                db.add(sa_role)
                await db.flush()

            # Create User
            new_sa = User(
                username="superadmin",
                email="superadmin@pinesphere.com",
                password_hash=hash_password("Admin@123!"),
                account_status="ACTIVE",
                email_verified=True,
                phone_verified=True
            )
            db.add(new_sa)
            await db.flush()

            # Assign Role
            new_ur = UserRole(user_id=new_sa.id, role_id=sa_role.id)
            db.add(new_ur)
            
            await db.commit()
            print("Created superadmin@pinesphere.com with password Admin@123!")

if __name__ == "__main__":
    asyncio.run(main())
