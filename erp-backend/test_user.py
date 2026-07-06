import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.authentication.user import User

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.id == '09b2e341-b700-4f62-9dcd-25046138cd2a'))
        user = res.scalars().first()
        print(f"User for allocation: {user.email if user else 'Not found'}")

asyncio.run(main())
