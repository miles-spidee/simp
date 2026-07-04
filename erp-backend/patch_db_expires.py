import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/simp_db")

async def patch():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        from sqlalchemy import text
        try:
            await conn.execute(text("ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS account_expires_at TIMESTAMP WITH TIME ZONE;"))
            print("Successfully patched database (account_expires_at)")
        except Exception as e:
            print("Error:", e)

asyncio.run(patch())
