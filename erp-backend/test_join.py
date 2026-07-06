import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.organizations.organization import Organization
from app.models.organizations.tndce_college import TNDCECollege
from app.models.core.allocation import Allocation

async def main():
    async with AsyncSessionLocal() as db:
        allocated_colleges = await db.execute(select(Allocation.target_id).where(Allocation.target_type == "COLLEGE"))
        allocs = allocated_colleges.scalars().all()
        print(f"Allocs: {allocs}")
        
        stmt = select(Organization.id, Organization.code, TNDCECollege.college_code).join(
            TNDCECollege, TNDCECollege.college_code == Organization.code
        ).where(TNDCECollege.id.in_(allocs))
        
        res = await db.execute(stmt)
        mapped = res.all()
        print(f"Mapped: {mapped}")

asyncio.run(main())
