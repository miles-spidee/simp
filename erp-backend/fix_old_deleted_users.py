import asyncio
from app.core.database import engine
from sqlalchemy import text

async def main():
    async with engine.begin() as conn:
        await conn.execute(text("UPDATE auth_users SET email = email || '_deleted_old', username = username || '_deleted_old' WHERE deleted_at IS NOT NULL AND email NOT LIKE '%_deleted_%'"))
    print('Cleaned up old deleted users')

if __name__ == "__main__":
    asyncio.run(main())
