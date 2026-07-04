import asyncio
from app.core.database import engine
from sqlalchemy import text

async def fix():
    async with engine.begin() as conn:
        # Find Bob's user id
        result = await conn.execute(text("SELECT id FROM auth_users WHERE email = 'student2@mock.com'"))
        bob_id = result.scalar()
        if not bob_id:
            print("Bob not found")
            return
            
        # Find Bob's student_profile_id
        result = await conn.execute(text(f"SELECT id FROM profile_students WHERE user_id = '{bob_id}'"))
        bob_profile_id = result.scalar()
        if not bob_profile_id:
            print("Bob profile not found")
            return
            
        # Delete Bob from MentorAssignment
        await conn.execute(text(f"DELETE FROM intern_mentor_assignments WHERE student_profile_id = '{bob_profile_id}'"))
        print("Bob's mentor assignment removed. Mentor will now see 1 student instead of 2.")

if __name__ == "__main__":
    asyncio.run(fix())
