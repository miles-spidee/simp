import asyncio
from app.core.database import AsyncSessionLocal
from app.models.authentication.user import User
from app.core.security import hash_password
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.email == 'superadmin@pinesphere.example.com'))
        user = res.scalar_one_or_none()
        if user:
            user.password_hash = hash_password("Admin@123!")
            db.add(user)
            await db.commit()
            print("Password reset successful!")
        else:
            print("User not found!")

if __name__ == "__main__":
    asyncio.run(main())
