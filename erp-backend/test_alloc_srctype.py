import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.core.allocation import Allocation

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Allocation).where(Allocation.target_type == "COLLEGE"))
        allocs = res.scalars().all()
        for a in allocs:
            print(f"Alloc: src={a.source_id}, target={a.target_id}, src_type={a.source_type}, status={a.status}, deleted={a.deleted_at}")

asyncio.run(main())
