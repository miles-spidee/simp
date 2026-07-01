import os
import uuid
import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.rbac.user_role import UserRole
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
if "?ssl=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(engine, expire_on_commit=False)

with SessionLocal() as session:
    res = session.execute(text("SELECT id FROM auth_users WHERE email = :email"), {"email": "admin@pinesphere.com"})
    admin_id = res.scalar()
    
    res = session.execute(text("SELECT id FROM rbac_roles WHERE code = :code"), {"code": "SUPER_ADMIN"})
    role_id = res.scalar()
    
    if admin_id and role_id:
        ur = UserRole(id=uuid.uuid4(), user_id=admin_id, role_id=role_id)
        session.add(ur)
        session.commit()
        print("Reassigned admin@pinesphere.com to SUPER_ADMIN")
    else:
        print("Could not find admin or role")
