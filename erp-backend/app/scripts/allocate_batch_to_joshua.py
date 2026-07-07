import sys, os; sys.path.insert(0, os.path.abspath('.'))
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings
import uuid

async def allocate():
    engine = create_async_engine(settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://'), echo=False)
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT id, username FROM authentication_users WHERE username = 'joshua'"))
        user = res.first()
        if not user:
            print("User joshua not found")
            return
        
        # Check employee profile
        res = await conn.execute(text("SELECT id FROM profile_employees WHERE user_id = :uid"), {"uid": user.id})
        emp = res.first()
        if not emp:
            print("No employee profile found for joshua")
            return
            
        emp_id = emp[0]
        
        # Get first batch
        res = await conn.execute(text("SELECT id, name FROM academic_batches LIMIT 1"))
        batch = res.first()
        if not batch:
            print("No batches found")
            return
            
        batch_id = batch[0]
        
        # Create allocation
        # We need to allocate the batch to joshua's employee profile
        allocation_id = uuid.uuid4()
        
        # Check if already allocated
        res = await conn.execute(text("SELECT id FROM core_allocations WHERE source_id = :sid AND target_id = :tid"), 
            {"sid": emp_id, "tid": batch_id})
        
        if res.first():
            print("Batch already allocated to joshua")
            return
            
        await conn.execute(
            text("""
                INSERT INTO core_allocations 
                (id, source_type, source_id, target_type, target_id, role, status, created_at, updated_at) 
                VALUES 
                (:id, 'EMPLOYEE', :sid, 'BATCH', :tid, 'PRIMARY', 'ACTIVE', NOW(), NOW())
            """),
            {"id": allocation_id, "sid": emp_id, "tid": batch_id}
        )
        
        await conn.commit()
        print(f"Successfully allocated batch {batch.name} to joshua")

if __name__ == "__main__":
    asyncio.run(allocate())
