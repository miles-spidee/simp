import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
if "?ssl=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]

engine = create_engine(DATABASE_URL)
with engine.connect() as conn:
    # Get all permissions
    res = conn.execute(text("SELECT id, code FROM rbac_permissions"))
    for row in res.fetchall():
        old_code = row.code
        new_code = old_code.replace(":", ".")
        new_code = new_code.replace(".read", ".view")
        
        if old_code != new_code:
            conn.execute(text("UPDATE rbac_permissions SET code = :new_code WHERE id = :id"), {"new_code": new_code, "id": row.id})
            
    # Do the same for Actions just in case
    conn.execute(text("UPDATE rbac_actions SET code = 'view', name = 'View' WHERE code = 'read'"))
            
    conn.commit()
    print("Permissions updated.")
