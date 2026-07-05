import asyncio
import asyncpg

async def check():
    conn = await asyncpg.connect(
        'postgresql://postgres:simpdb123@simp-db-instance.ciziy0eocsqh.us-east-1.rds.amazonaws.com:5432/simp_db',
        ssl='require'
    )
    try:
        rows = await conn.fetch(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%program%' ORDER BY tablename"
        )
        print('Program tables:', [r['tablename'] for r in rows])
    finally:
        await conn.close()

asyncio.run(check())
