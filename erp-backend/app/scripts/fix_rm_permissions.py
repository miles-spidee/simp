import sys, os; sys.path.insert(0, os.path.abspath('.'))
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings
import uuid

async def fix():
    engine = create_async_engine(settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://'), echo=False)
    async with engine.connect() as conn:
        # Get REPORTING_MANAGER role id
        res = await conn.execute(text("SELECT id FROM rbac_roles WHERE code = 'REPORTING_MANAGER'"))
        row = res.first()
        if not row:
            print("REPORTING_MANAGER role not found")
            return
        role_id = row[0]
        
        # Get REPORTING_MANAGER_MOD permissions
        res = await conn.execute(text("SELECT id FROM rbac_permissions WHERE code LIKE 'REPORTING_MANAGER_MOD.%'"))
        perm_ids = [r[0] for r in res.fetchall()]
        
        if not perm_ids:
            print("No permissions found for REPORTING_MANAGER_MOD")
            return
            
        print(f"Found {len(perm_ids)} permissions for REPORTING_MANAGER_MOD")
        
        # Check existing mappings
        res = await conn.execute(text("SELECT permission_id FROM rbac_role_permissions WHERE role_id = :rid"), {"rid": role_id})
        existing_perm_ids = {r[0] for r in res.fetchall()}
        
        # Add missing mappings
        added = 0
        for pid in perm_ids:
            if pid not in existing_perm_ids:
                await conn.execute(
                    text("INSERT INTO rbac_role_permissions (id, role_id, permission_id) VALUES (:id, :rid, :pid)"),
                    {"id": uuid.uuid4(), "rid": role_id, "pid": pid}
                )
                added += 1
                
        await conn.commit()
        print(f"Added {added} permissions to REPORTING_MANAGER")

if __name__ == "__main__":
    asyncio.run(fix())
