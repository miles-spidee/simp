import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.authentication.user import User

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.email == 'akilanck@duck.com'))
        user = res.scalars().first()
        print(f"User ID: {user.id}")

asyncio.run(main())
