from uuid import UUID
from typing import List
from datetime import date
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.base import BaseService
from app.modules.allocation.schemas import AllocationCreate, AllocationUpdate
from app.models.core.allocation import Allocation

class AllocationService(BaseService):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_allocations(self, target_type: str = None, target_id: UUID = None) -> List[dict]:
        stmt = select(Allocation).where(Allocation.deleted_at == None)
        if target_type:
            stmt = stmt.where(Allocation.target_type == target_type)
        if target_id:
            stmt = stmt.where(Allocation.target_id == target_id)
            
        result = await self.db.execute(stmt)
        rows = result.scalars().all()
        
        return rows

    async def sync_student_programs_from_applications(self) -> int:
        from app.models.internships.application import Application
        from app.models.internships.opportunity import Opportunity
        
        stmt = (
            select(Application.student_profile_id, Opportunity.program_id)
            .join(Opportunity, Application.opportunity_id == Opportunity.id)
            .where(Opportunity.program_id.isnot(None))
            .where(Application.deleted_at.is_(None))
        )
        result = await self.db.execute(stmt)
        mappings = result.all()

        added = 0
        for student_id, program_id in mappings:
            check_stmt = select(Allocation).where(
                Allocation.source_type == "STUDENT",
                Allocation.source_id == student_id,
                Allocation.target_type == "PROGRAM",
                Allocation.target_id == program_id,
                Allocation.role == "STUDENT",
                Allocation.deleted_at.is_(None)
            )
            existing = await self.db.scalar(check_stmt)
            
            if not existing:
                new_allocation = Allocation(
                    source_type="STUDENT",
                    source_id=student_id,
                    target_type="PROGRAM",
                    target_id=program_id,
                    role="STUDENT",
                    start_date=date.today(),
                    status="ACTIVE",
                    created_by=student_id,
                    updated_by=student_id
                )
                self.db.add(new_allocation)
                added += 1
                
        await self.commit_transaction()
        return added

    async def create_allocation(self, data: AllocationCreate, user_id: UUID):
        # Check duplicate
        stmt = select(Allocation).where(
            Allocation.source_type == data.source_type,
            Allocation.source_id == data.source_id,
            Allocation.target_type == data.target_type,
            Allocation.target_id == data.target_id,
            Allocation.role == data.role,
            Allocation.deleted_at == None
        )
        existing = await self.db.scalar(stmt)
        if existing:
            raise HTTPException(status_code=409, detail="Allocation already exists")

        allocation = Allocation(
            source_type=data.source_type,
            source_id=data.source_id,
            target_type=data.target_type,
            target_id=data.target_id,
            role=data.role,
            start_date=data.start_date or date.today(),
            end_date=data.end_date,
            status=data.status,
            created_by=user_id,
            updated_by=user_id
        )
        self.db.add(allocation)
        
        await self.log_audit_event(
            action="CREATE_ALLOCATION",
            entity="Allocation",
            user_id=user_id,
            new_value=f"{data.source_type}:{data.source_id} -> {data.target_type}:{data.target_id} ({data.role})"
        )
        
        await self.commit_transaction()
        return allocation

    async def update_allocation(self, allocation_id: UUID, data: AllocationUpdate, user_id: UUID):
        allocation = await self.db.get(Allocation, allocation_id)
        if not allocation or allocation.deleted_at:
            raise HTTPException(status_code=404, detail="Allocation not found")
            
        if data.status:
            allocation.status = data.status
        if data.end_date:
            allocation.end_date = data.end_date
            
        allocation.updated_by = user_id
        
        await self.log_audit_event(
            action="UPDATE_ALLOCATION",
            entity="Allocation",
            user_id=user_id,
            new_value=f"Status: {allocation.status}"
        )
        
        await self.commit_transaction()
        return allocation

    async def delete_allocation(self, allocation_id: UUID, user_id: UUID):
        allocation = await self.db.get(Allocation, allocation_id)
        if not allocation or allocation.deleted_at:
            raise HTTPException(status_code=404, detail="Allocation not found")
            
        await self.soft_delete(allocation, user_id)
        
        await self.log_audit_event(
            action="DELETE_ALLOCATION",
            entity="Allocation",
            user_id=user_id,
            old_value=str(allocation_id)
        )
        
        await self.commit_transaction()