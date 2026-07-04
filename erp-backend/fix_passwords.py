import asyncio
from app.core.database import engine
from sqlalchemy import text
from app.core.security import hash_password

async def fix():
    hashed_pw = hash_password("password123")
    async with engine.begin() as conn:
        # Update all dummy users that have the plain literal 'hash' as their password_hash
        await conn.execute(text(f"UPDATE auth_users SET password_hash = '{hashed_pw}' WHERE password_hash = 'hash'"))
        print("Updated dummy users password to 'password123'")

if __name__ == "__main__":
    asyncio.run(fix())
