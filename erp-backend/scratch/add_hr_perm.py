import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def main():
    engine = create_async_engine("postgresql+asyncpg://postgres:simpdb123@simp-db-instance.ciziy0eocsqh.us-east-1.rds.amazonaws.com:5432/simp_db")
    async with engine.begin() as conn:
        # Get HR role ID
        res = await conn.execute(text("SELECT id FROM rbac_roles WHERE code = 'HR'"))
        hr_role = res.first()
        if not hr_role:
            print("HR role not found")
            return
        hr_role_id = hr_role[0]

        # Get Mentor Profile create permission ID
        res = await conn.execute(text("SELECT id FROM rbac_permissions WHERE code = 'MENTOR_PROFILE.create'"))
        perm = res.first()
        if not perm:
            print("Mentor Profile create perm not found")
            return
        perm_id = perm[0]

        # Insert Role Permission
        await conn.execute(text("INSERT INTO rbac_role_permissions (id, role_id, permission_id) VALUES (:id, :r_id, :p_id) ON CONFLICT DO NOTHING"), {
            "id": str(uuid.uuid4()),
            "r_id": hr_role_id,
            "p_id": perm_id
        })
        print("Granted MENTOR_PROFILE.create to HR")
    await engine.dispose()

asyncio.run(main())
