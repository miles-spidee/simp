import asyncio
from sqlalchemy import text
from app.core.database import engine

async def main():
    async with engine.begin() as conn:
        # Ignore aws_commons schema error if it occurs for SET search_path,
        # but since we're using engine directly, it might not set it up unless event listeners do.
        await conn.execute(text("ALTER TABLE profile_mentors DROP CONSTRAINT IF EXISTS ix_profile_mentors_user_id;"))
        await conn.execute(text("ALTER TABLE profile_mentors DROP CONSTRAINT IF EXISTS ix_profile_mentors_employee_profile_id;"))
        
        await conn.execute(text("DROP INDEX IF EXISTS ix_profile_mentors_user_id;"))
        await conn.execute(text("DROP INDEX IF EXISTS ix_profile_mentors_employee_profile_id;"))
        
        await conn.execute(text("ALTER TABLE profile_mentors DROP CONSTRAINT IF EXISTS profile_mentors_user_id_key;"))
        await conn.execute(text("ALTER TABLE profile_mentors DROP CONSTRAINT IF EXISTS profile_mentors_employee_profile_id_key;"))
        
        await conn.execute(text("DROP INDEX IF EXISTS ix_mentor_user_unique;"))
        await conn.execute(text("DROP INDEX IF EXISTS ix_mentor_employee_unique;"))

        await conn.execute(text("CREATE UNIQUE INDEX ix_mentor_user_unique ON profile_mentors(user_id) WHERE deleted_at IS NULL;"))
        await conn.execute(text("CREATE UNIQUE INDEX ix_mentor_employee_unique ON profile_mentors(employee_profile_id) WHERE deleted_at IS NULL;"))
        
        print("Successfully updated mentor unique constraints.")

if __name__ == "__main__":
    asyncio.run(main())
