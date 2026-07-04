import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import select, delete
from app.core.database import AsyncSessionLocal
from app.models.authentication.user import User
from app.models.rbac.role import Role
from app.models.rbac.user_role import UserRole

async def make_superadmin():
    async with AsyncSessionLocal() as db:
        email = "admin@pinesphere.example.com"
        print(f"Looking for user {email}...")
        
        user = (await db.execute(select(User).where(User.email == email))).scalars().first()
        if not user:
            print(f"Error: User {email} not found!")
            return
            
        print("Resetting password to ChangeMe@123...")
        from app.core.security import hash_password
        user.password_hash = hash_password("ChangeMe@123")
        user.account_status = "ACTIVE"
            
        print(f"Looking for SUPER_ADMIN role...")
        role = (await db.execute(select(Role).where(Role.code == "SUPER_ADMIN"))).scalars().first()
        if not role:
            print("Error: SUPER_ADMIN role not found! Did you run upload_roles.py?")
            return
            
        # Check if already assigned
        existing = (await db.execute(
            select(UserRole).where(UserRole.user_id == user.id, UserRole.role_id == role.id)
        )).scalars().first()
        
        if not existing:
            print("Assigning SUPER_ADMIN role...")
            user_role = UserRole(user_id=user.id, role_id=role.id)
            db.add(user_role)
            
        await db.commit()
        
        print(f"Success! {email} is now a SUPER_ADMIN with password 'ChangeMe@123'.")

if __name__ == "__main__":
    asyncio.run(make_superadmin())
