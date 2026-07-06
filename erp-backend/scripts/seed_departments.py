import asyncio
import uuid
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.organizations.organization import Organization
from app.models.organizations.department import Department

async def seed_departments():
    async with AsyncSessionLocal() as session:
        # Get the first organization
        result = await session.execute(select(Organization).limit(1))
        org = result.scalar_one_or_none()
        
        if not org:
            print("No organization found. Please create an organization first.")
            return

        departments_to_add = [
            {"name": "Computer Science and Engineering", "code": "CSE"},
            {"name": "Information Technology", "code": "IT"},
            {"name": "Electronics and Communication Engineering", "code": "ECE"},
            {"name": "Mechanical Engineering", "code": "MECH"},
            {"name": "Civil Engineering", "code": "CIVIL"},
            {"name": "Electrical and Electronics Engineering", "code": "EEE"},
        ]

        # Check if they already exist
        existing_result = await session.execute(select(Department).filter_by(organization_id=org.id))
        existing_codes = {d.code for d in existing_result.scalars()}

        added_count = 0
        for dept_data in departments_to_add:
            if dept_data["code"] not in existing_codes:
                dept = Department(
                    organization_id=org.id,
                    name=dept_data["name"],
                    code=dept_data["code"]
                )
                session.add(dept)
                added_count += 1
        
        await session.commit()
        print(f"Added {added_count} departments to organization {org.name} successfully.")

if __name__ == "__main__":
    asyncio.run(seed_departments())
