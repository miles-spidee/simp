import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def main():
    engine = create_async_engine("postgresql+asyncpg://postgres:simpdb123@simp-db-instance.ciziy0eocsqh.us-east-1.rds.amazonaws.com:5432/simp_db")
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT id, name, is_active FROM comp_companies"))
        rows = result.fetchall()
        print(f"Total companies: {len(rows)}")
        for row in rows:
            print(dict(row._mapping))
    await engine.dispose()

asyncio.run(main())
