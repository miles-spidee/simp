from uuid import UUID
from typing import List

from fastapi import HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.base import BaseService

from app.modules.allocation.repository import AllocationRepository
from app.modules.allocation.schemas import (
    AllocationCreate,
    AllocationUpdate,
)

from app.models.internships.mentor_assignment import MentorAssignment
from app.models.profiles.student_profile import StudentProfile
from app.models.profiles.mentor_profile import MentorProfile
from app.models.internships.opportunity import Opportunity


class AllocationService(BaseService):

    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.repository = AllocationRepository()

    # ---------------------------------------------------------
    # GET ALL
    # ---------------------------------------------------------

    async def get_allocations(self) -> List[MentorAssignment]:
        result, _ = await self.repository.get_paginated(
            self.db,
            page=1,
            page_size=5000,
        )
        return result

    # ---------------------------------------------------------
    # GET BY ID
    # ---------------------------------------------------------

    async def get_allocation(
        self,
        allocation_id: UUID,
    ) -> MentorAssignment:

        allocation = await self.repository.get(
            self.db,
            allocation_id,
        )

        if not allocation:
            raise HTTPException(
                status_code=404,
                detail="Allocation not found",
            )

        return allocation

    # ---------------------------------------------------------
    # CREATE
    # ---------------------------------------------------------

    async def create_allocation(
        self,
        data: AllocationCreate,
        user_id: UUID,
    ) -> MentorAssignment:

        # -------------------------------
        # Validate Student
        # -------------------------------

        student = await self.db.get(
            StudentProfile,
            data.student_profile_id,
        )

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found",
            )

        # -------------------------------
        # Validate Mentor
        # -------------------------------

        mentor = await self.db.get(
            MentorProfile,
            data.mentor_profile_id,
        )

        if not mentor:
            raise HTTPException(
                status_code=404,
                detail="Mentor not found",
            )

        # -------------------------------
        # Mentor Availability
        # -------------------------------

        if not mentor.is_available:
            raise HTTPException(
                status_code=400,
                detail="Mentor is currently unavailable",
            )

        # -------------------------------
        # Capacity Check
        # -------------------------------

        count_stmt = (
            select(func.count())
            .select_from(MentorAssignment)
            .where(
                MentorAssignment.mentor_profile_id
                == mentor.id,
                MentorAssignment.status == "ACTIVE",
            )
        )

        active_students = await self.db.scalar(count_stmt)

        if active_students >= mentor.max_capacity:
            raise HTTPException(
                status_code=400,
                detail="Mentor capacity exceeded",
            )

        # -------------------------------
        # Duplicate Assignment
        # -------------------------------

        duplicate_stmt = (
            select(MentorAssignment)
            .where(
                MentorAssignment.student_profile_id
                == data.student_profile_id,
                MentorAssignment.mentor_profile_id
                == data.mentor_profile_id,
                MentorAssignment.status == "ACTIVE",
            )
        )

        duplicate = await self.db.scalar(duplicate_stmt)

        if duplicate:
            raise HTTPException(
                status_code=409,
                detail="Student is already assigned to this mentor",
            )

        # -------------------------------
        # Opportunity Validation
        # -------------------------------

        if data.opportunity_id:

            opportunity = await self.db.get(
                Opportunity,
                data.opportunity_id,
            )

            if not opportunity:
                raise HTTPException(
                    status_code=404,
                    detail="Opportunity not found",
                )

        # -------------------------------
        # Date Validation
        # -------------------------------

        if (
            data.end_date
            and data.end_date <= data.start_date
        ):
            raise HTTPException(
                status_code=400,
                detail="End date must be after start date",
            )

        # -------------------------------
        # Create Allocation
        # -------------------------------

        allocation = await self.repository.create(
            self.db,
            obj_in=data,
        )

        await self.log_audit_event(
            action="CREATE_ALLOCATION",
            entity="MentorAssignment",
            user_id=user_id,
            new_value=str(allocation.id),
        )

        await self.commit_transaction()

        return allocation

    # ---------------------------------------------------------
    # UPDATE
    # ---------------------------------------------------------

    async def update_allocation(
        self,
        allocation_id: UUID,
        data: AllocationUpdate,
        user_id: UUID,
    ) -> MentorAssignment:

        allocation = await self.get_allocation(
            allocation_id,
        )

        allocation = await self.repository.update(
            self.db,
            db_obj=allocation,
            obj_in=data,
        )

        await self.log_audit_event(
            action="UPDATE_ALLOCATION",
            entity="MentorAssignment",
            user_id=user_id,
            new_value=str(allocation.id),
        )

        await self.commit_transaction()

        return allocation

    # ---------------------------------------------------------
    # DELETE
    # ---------------------------------------------------------

    async def delete_allocation(
        self,
        allocation_id: UUID,
        user_id: UUID,
    ):

        allocation = await self.repository.delete(
            self.db,
            id=allocation_id,
        )

        if not allocation:
            raise HTTPException(
                status_code=404,
                detail="Allocation not found",
            )

        await self.log_audit_event(
            action="DELETE_ALLOCATION",
            entity="MentorAssignment",
            user_id=user_id,
            old_value=str(allocation_id),
        )

        await self.commit_transaction()

        return allocation