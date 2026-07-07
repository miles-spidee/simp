import sys, os; sys.path.insert(0, os.path.abspath('.'))
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def query():
    engine = create_async_engine(settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://'), echo=False)
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT id, username FROM authentication_users WHERE username = 'joshua'"))
        user = res.first()
        if not user:
            print("User joshua not found")
            return
        print(f"User joshua: {user.id}")
        
        # Check employee profile
        res = await conn.execute(text("SELECT id FROM profile_employees WHERE user_id = :uid"), {"uid": user.id})
        emp = res.first()
        if emp:
            print(f"Employee profile: {emp.id}")
        else:
            print("No employee profile found")
            
        # Check batches
        res = await conn.execute(text("SELECT id, name FROM academic_batches LIMIT 3"))
        batches = res.fetchall()
        print("Batches:")
        for b in batches:
            print(f" - {b.id}: {b.name}")
            
        # Check allocations
        res = await conn.execute(text("SELECT * FROM core_allocations WHERE target_type = 'BATCH'"))
        allocs = res.fetchall()
        print("Allocations to batches:")
        for a in allocs:
            print(f" - {a.source_type} {a.source_id} -> {a.target_type} {a.target_id}")

if __name__ == "__main__":
    asyncio.run(query())
