import sys, os; sys.path.insert(0, os.path.abspath('.'))
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def main():
    engine = create_async_engine(settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://'), echo=False)
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT id, name, program_id, deleted_at FROM acad_batches WHERE id IN ('a2a2af00-fb2c-4ac3-a816-daddc435f0cd', 'c991be55-847b-4f94-90d3-d927a469a7d7')"))
        print("Batches:", res.fetchall())
        
        res = await conn.execute(text("SELECT id, name, deleted_at FROM acad_programs"))
        print("Programs:", res.fetchall())

asyncio.run(main())
