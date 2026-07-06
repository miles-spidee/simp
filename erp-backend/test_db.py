import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.profiles.student_profile import StudentProfile
from app.models.organizations.organization import Organization
from app.models.organizations.tndce_college import TNDCECollege
from app.models.core.allocation import Allocation
from app.models.authentication.user import User

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(StudentProfile.id, StudentProfile.user_id, StudentProfile.organization_id))
        students = res.all()
        print("Students:")
        for s in students:
            res_u = await db.execute(select(User.email).where(User.id == s.user_id))
            u = res_u.scalars().first()
            print(f"Student: id={s.id}, email={u}, org={s.organization_id}")
            
        res = await db.execute(select(Organization.id, Organization.name, Organization.code))
        orgs = res.all()
        print("\nOrganizations:")
        for o in orgs:
            print(o)
            
        res = await db.execute(select(TNDCECollege.id, TNDCECollege.name, TNDCECollege.college_code).limit(10))
        cols = res.all()
        print("\nTNDCE Colleges:")
        for c in cols:
            print(c)
            
        res = await db.execute(select(Allocation.source_id, Allocation.target_id, Allocation.role).where(Allocation.target_type == "COLLEGE"))
        allocs = res.all()
        print("\nCollege Allocations:")
        for a in allocs:
            print(a)

asyncio.run(main())
