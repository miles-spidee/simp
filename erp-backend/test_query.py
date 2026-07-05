import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.profiles.student_profile import StudentProfile
from app.models.authentication.user import User

async def main():
    async with AsyncSessionLocal() as db:
        try:
            stmt = select(StudentProfile, User).join(User, User.id == StudentProfile.user_id)
            print("Executing query...")
            res = await db.execute(stmt)
            rows = res.all()
            print(f"Got {len(rows)} rows.")
        except Exception as e:
            print("Failed:", e)

if __name__ == "__main__":
    asyncio.run(main())
