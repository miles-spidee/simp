import asyncio
from uuid import UUID
from app.core.database import SessionLocal
from sqlalchemy import select
from app.models.authentication.user import User
from app.models.profiles.student_profile import StudentProfile
from app.core.security_filters import apply_student_filter

async def main():
    async with SessionLocal() as db:
        res = await db.execute(select(User).where(User.email == "anishda07@gmail.com"))
        user = res.scalars().first()
        if not user:
            print("User not found")
            return
            
        print("User:", user.email)
        query = select(StudentProfile.id, StudentProfile.organization_id)
        filtered = await apply_student_filter(query, db, user, StudentProfile)
        
        # print the compiled query
        print("Query:", filtered.compile(compile_kwargs={"literal_binds": True}))
        
        res = await db.execute(filtered)
        students = res.all()
        print("Students:", len(students))
        for s in students:
            print(s)

asyncio.run(main())
