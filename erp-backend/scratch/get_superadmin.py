import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import text

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(text("SELECT email FROM auth_users LIMIT 5"))
        print(res.fetchall())

asyncio.run(main())
