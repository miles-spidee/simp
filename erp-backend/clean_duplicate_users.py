import asyncio
import os
from sqlalchemy import text
from app.core.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as db:
        # Get emails that have duplicates
        result = await db.execute(text("""
            SELECT email, count(*) 
            FROM auth_users 
            GROUP BY email 
            HAVING count(*) > 1;
        """))
        duplicates = result.all()
        print(f"Found {len(duplicates)} emails with duplicate accounts.")

        for email, count in duplicates:
            print(f"Cleaning duplicates for email: {email} (Total: {count})")
            # Get all IDs for this email ordered by created_at ascending
            id_result = await db.execute(text("""
                SELECT id FROM auth_users 
                WHERE email = :email 
                ORDER BY created_at ASC;
            """), {"email": email})
            ids = [row[0] for row in id_result.all()]
            
            # Keep the first one, delete the rest
            ids_to_delete = ids[1:]
            
            if ids_to_delete:
                # First delete dependent records (like user_roles, user_modules)
                # But cascade delete should handle it if set up. Let's delete from auth_users.
                # Actually, let's check what depends on auth_users.
                print(f"Deleting {len(ids_to_delete)} duplicate accounts for {email}...")
                
                # We can just delete them
                await db.execute(text("""
                    DELETE FROM rbac_user_roles WHERE user_id = ANY(:ids);
                """), {"ids": ids_to_delete})
                
                await db.execute(text("""
                    DELETE FROM rbac_user_modules WHERE user_id = ANY(:ids);
                """), {"ids": ids_to_delete})
                
                await db.execute(text("""
                    DELETE FROM auth_users WHERE id = ANY(:ids);
                """), {"ids": ids_to_delete})
                
        await db.commit()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
