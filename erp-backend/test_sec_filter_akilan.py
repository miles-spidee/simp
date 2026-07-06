import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.authentication.user import User
from app.models.profiles.student_profile import StudentProfile
from app.core.security_filters import apply_student_filter

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.email == 'akilanck@duck.com'))
        user = res.scalars().first()
        print(f"User: {user.email}")
        
        # Test student filter
        query = select(StudentProfile.id, StudentProfile.user_id, StudentProfile.organization_id)
        filtered = await apply_student_filter(query, db, user, StudentProfile)
        
        res = await db.execute(filtered)
        students = res.all()
        print(f"Students count: {len(students)}")
        for s in students:
            res_u = await db.execute(select(User.email).where(User.id == s.user_id))
            print(f"Student {res_u.scalars().first()}: org={s.organization_id}")

asyncio.run(main())
