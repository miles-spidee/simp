import asyncio
from sqlalchemy.ext.asyncio import create_async_engine

async def main():
    engine = create_async_engine("postgresql+asyncpg://postgres:simpdb123@simp-db-instance.ciziy0eocsqh.us-east-1.rds.amazonaws.com:5432/simp_db")
    try:
        async with engine.connect() as conn:
            print("Successfully connected to the database!")
    except Exception as e:
        print(f"Failed to connect to database: {e}")
    finally:
        await engine.dispose()

asyncio.run(main())
