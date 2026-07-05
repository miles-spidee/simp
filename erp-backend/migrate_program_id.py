import asyncio
import asyncpg

async def migrate():
    conn = await asyncpg.connect(
        'postgresql://postgres:simpdb123@simp-db-instance.ciziy0eocsqh.us-east-1.rds.amazonaws.com:5432/simp_db',
        ssl='require'
    )
    try:
        await conn.execute(
            'ALTER TABLE intern_opportunities ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES acad_programs(id) ON DELETE SET NULL'
        )
        print('Migration complete: program_id added to intern_opportunities')
    except Exception as e:
        print('Migration note:', e)
    finally:
        await conn.close()

asyncio.run(migrate())
