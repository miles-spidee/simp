import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

async def kill_locks():
    engine = create_async_engine(DATABASE_URL, echo=False)
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' OR state = 'active' AND pid <> pg_backend_pid();"))
        print(f"Killed {len(res.fetchall())} connections.")
        await conn.commit()

asyncio.run(kill_locks())
