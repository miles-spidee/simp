"""
One-time migration script: Create ref_tndce_colleges table and seed it.
Run with: python3 create_tndce_table.py
"""
import asyncio
from app.core.database import engine
from sqlalchemy import text

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS ref_tndce_colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    college_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    version_id INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS ix_ref_tndce_colleges_name ON ref_tndce_colleges(name);
CREATE INDEX IF NOT EXISTS ix_ref_tndce_colleges_district ON ref_tndce_colleges(district);
CREATE INDEX IF NOT EXISTS ix_ref_tndce_colleges_region ON ref_tndce_colleges(region);
CREATE INDEX IF NOT EXISTS ix_ref_tndce_colleges_college_type ON ref_tndce_colleges(college_type);
CREATE INDEX IF NOT EXISTS ix_ref_tndce_colleges_college_code ON ref_tndce_colleges(college_code);
"""

async def main():
    async with engine.begin() as conn:
        print("Creating ref_tndce_colleges table...")
        await conn.execute(text(CREATE_TABLE_SQL))
        print("Table created (or already exists).")

        # Check if already seeded
        result = await conn.execute(text("SELECT COUNT(*) FROM ref_tndce_colleges"))
        count = result.scalar()
        print(f"Current row count: {count}")

    if count == 0:
        print("Seeding via /api/v1/student/colleges endpoint logic...")
        # Import and run seed directly
        from app.core.database import AsyncSessionLocal
        from app.modules.student.router import sync_colleges_task
        async with AsyncSessionLocal() as db:
            await sync_colleges_task(db)
            print("Seed complete.")
    else:
        print(f"Already has {count} records. Skipping seed.")

    print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
