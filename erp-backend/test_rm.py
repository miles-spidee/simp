import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.modules.reporting_manager.service import ReportingManagerService
from app.models.authentication.user import User
from app.models.rbac.user_role import UserRole
from app.models.rbac.role import Role
from sqlalchemy import select

load_dotenv()
url = os.getenv('DATABASE_URL').replace('postgresql://', 'postgresql+asyncpg://')
engine = create_async_engine(url)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def run():
    async with AsyncSessionLocal() as session:
        # Find a reporting manager
        res = await session.execute(
            select(User)
            .join(UserRole, UserRole.user_id == User.id)
            .join(Role, Role.id == UserRole.role_id)
            .where(Role.code == 'REPORTING_MANAGER')
            .limit(1)
        )
        rm = res.scalars().first()
        if not rm:
            print("No RM found")
            return
            
        print(f"Testing for RM: {rm.email} ({rm.id})")
        service = ReportingManagerService(session)
        
        batches = await service.get_allocated_batches(rm.id)
        print("Batches:", batches)
        
        for b in batches:
            students = await service.get_students_in_batch(b['batch_id'])
            print(f"Students in {b['batch_name']}:", len(students))
            
            mentors = await service.get_mentors_in_batch(b['batch_id'])
            print(f"Mentors in {b['batch_name']}:", len(mentors))

asyncio.run(run())
