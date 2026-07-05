
from sqlalchemy.ext.asyncio import AsyncSession


from app.services.base import BaseService
from app.modules.opportunity.repository import OpportunityRepository
from app.modules.opportunity.schemas import (
    OpportunityCreate,
    OpportunityUpdate,
)
from sqlalchemy import select
from fastapi import HTTPException

from app.models.companies.company import Company
from app.models.internships.opportunity import Opportunity

class OpportunityService(BaseService):

    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.repository = OpportunityRepository()

    async def get_all(self):
        return await self.repository.get_all(self.db)

    async def get(self, opportunity_id):
        opportunity = await self.repository.get_by_id(
            self.db,
            opportunity_id,
        )

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found",
            )

        return opportunity

    async def create(self, data: OpportunityCreate):

        result = await self.db.execute(
            select(Company).where(Company.is_active == True)
        )

        company = result.scalars().first()

        if not company:
            raise HTTPException(
                status_code=404,
                detail="No active company found."
            )

        opportunity = Opportunity(
            company_id=company.id,
            program_id=data.program_id,
            title=data.project_title,
            description=data.role_description,
            status=data.opening_status.upper(),

            location=data.location,
            stipend=data.stipend,
            fee=data.fee,
            duration_weeks=data.duration_weeks,
            requirements=data.requirements,
            deadline=data.deadline,
        )

        self.db.add(opportunity)

        await self.commit_transaction()
        await self.db.refresh(opportunity)

        # Send Opportunity Published notifications to students
        try:
            from app.models.authentication.user import User as DBUser
            from app.models.profiles.student_profile import StudentProfile
            from app.services.notification_service import notification_service
            
            res_users = await self.db.execute(select(DBUser).join(StudentProfile, StudentProfile.user_id == DBUser.id))
            students = res_users.scalars().all()
            
            for s in students:
                await notification_service.send_opportunity_published(
                    title=opportunity.title,
                    description=opportunity.description or "",
                    recipient_email=s.email
                )
        except Exception as e:
            print("Error notifying students of opportunity:", e)

        return opportunity

    async def update(
        self,
        opportunity_id,
        data: OpportunityUpdate,
    ):
        opportunity = await self.get(opportunity_id)

        opportunity = await self.repository.update(
            self.db,
            db_obj=opportunity,
            obj_in=data,
        )

        await self.commit_transaction()

        return opportunity

    async def delete(self, opportunity_id):
        await self.repository.delete(
            self.db,
            id=opportunity_id,
        )

        await self.commit_transaction()

    async def get_mentors(self, opportunity_id):
        from app.models.internships.opportunity_mentor import OpportunityMentor
        from sqlalchemy import select
        
        result = await self.db.execute(
            select(OpportunityMentor).where(OpportunityMentor.opportunity_id == opportunity_id)
        )
        return result.scalars().all()

    async def assign_mentor(self, opportunity_id, mentor_profile_id):
        from app.models.internships.opportunity_mentor import OpportunityMentor
        
        # Check if already assigned
        from sqlalchemy import select
        result = await self.db.execute(
            select(OpportunityMentor).where(
                OpportunityMentor.opportunity_id == opportunity_id,
                OpportunityMentor.mentor_profile_id == mentor_profile_id
            )
        )
        existing = result.scalars().first()
        if existing:
            return existing
            
        mentor = OpportunityMentor(
            opportunity_id=opportunity_id,
            mentor_profile_id=mentor_profile_id
        )
        self.db.add(mentor)
        await self.commit_transaction()
        await self.db.refresh(mentor)
        return mentor

    async def remove_mentor(self, opportunity_id, mentor_profile_id):
        from app.models.internships.opportunity_mentor import OpportunityMentor
        from sqlalchemy import select
        
        result = await self.db.execute(
            select(OpportunityMentor).where(
                OpportunityMentor.opportunity_id == opportunity_id,
                OpportunityMentor.mentor_profile_id == mentor_profile_id
            )
        )
        mentor = result.scalars().first()
        
        if mentor:
            await self.db.delete(mentor)
            await self.commit_transaction()