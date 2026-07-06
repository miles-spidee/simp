import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import uuid

async def main():
    engine = create_async_engine("postgresql+asyncpg://postgres:simpdb123@simp-db-instance.ciziy0eocsqh.us-east-1.rds.amazonaws.com:5432/simp_db")
    async with engine.begin() as conn:
        cid = str(uuid.uuid4())
        await conn.execute(text("""
            INSERT INTO comp_companies (id, name, industry, is_active, created_at, updated_at, version_id)
            VALUES (:id, 'Nexus Solutions', 'Software', true, now(), now(), 1)
        """), {"id": cid})
        print("Company created!")
    await engine.dispose()

asyncio.run(main())
