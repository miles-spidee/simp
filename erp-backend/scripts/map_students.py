import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.internships.application import Application
from app.models.internships.opportunity import Opportunity
from app.models.core.allocation import Allocation
from datetime import date

async def map_students_to_programs():
    async with AsyncSessionLocal() as session:
        # Get all applications with their opportunities
        stmt = (
            select(Application.student_profile_id, Opportunity.program_id)
            .join(Opportunity, Application.opportunity_id == Opportunity.id)
            .where(Opportunity.program_id.isnot(None))
            .where(Application.deleted_at.is_(None))
        )
        result = await session.execute(stmt)
        mappings = result.all()

        added = 0
        for student_id, program_id in mappings:
            # Check if allocation already exists
            check_stmt = select(Allocation).where(
                Allocation.source_type == "STUDENT",
                Allocation.source_id == student_id,
                Allocation.target_type == "PROGRAM",
                Allocation.target_id == program_id,
                Allocation.role == "STUDENT",
                Allocation.deleted_at.is_(None)
            )
            existing = await session.scalar(check_stmt)
            
            if not existing:
                new_allocation = Allocation(
                    source_type="STUDENT",
                    source_id=student_id,
                    target_type="PROGRAM",
                    target_id=program_id,
                    role="STUDENT",
                    start_date=date.today(),
                    status="ACTIVE"
                )
                session.add(new_allocation)
                added += 1
                
        await session.commit()
        print(f"Successfully mapped {added} students to their programs based on applications.")

if __name__ == "__main__":
    asyncio.run(map_students_to_programs())
