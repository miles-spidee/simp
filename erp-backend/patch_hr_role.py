import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def patch():
    async with AsyncSessionLocal() as session:
        # Get HR role ID
        res = await session.execute(text("SELECT id FROM rbac_roles WHERE code = 'HR'"))
        hr_role_id = res.scalar()
        if not hr_role_id:
            print("HR role not found")
            return
            
        # Get IDENTITY_USER permissions
        res = await session.execute(text("""
            SELECT p.id 
            FROM rbac_permissions p
            JOIN rbac_features f ON p.feature_id = f.id
            JOIN rbac_modules m ON f.module_id = m.id
            WHERE m.code = 'IDENTITY_USER'
        """))
        perm_ids = res.scalars().all()
        
        for pid in perm_ids:
            try:
                await session.execute(
                    text("INSERT INTO rbac_role_permissions (role_id, permission_id) VALUES (:rid, :pid) ON CONFLICT DO NOTHING"),
                    {"rid": hr_role_id, "pid": pid}
                )
            except Exception as e:
                pass
                
        await session.commit()
        print(f"Added {len(perm_ids)} permissions for IDENTITY_USER to HR role.")

if __name__ == "__main__":
    asyncio.run(patch())
