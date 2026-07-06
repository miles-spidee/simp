import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.rbac.module import Module
async def check():
    async with AsyncSessionLocal() as db:
        mods = await db.execute(select(Module.code))
        print("Module codes:", [m for m in mods.scalars().all()])
asyncio.run(check())
