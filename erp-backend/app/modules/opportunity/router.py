from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
# NOTE: endpoints return raw Pydantic models (not wrapped)

from app.modules.opportunity.service import OpportunityService
from app.modules.opportunity.schemas import (
    OpportunityCreate,
    OpportunityUpdate,
    OpportunityResponse,
    OpportunityMentorCreate,
    OpportunityMentorResponse,
)

router = APIRouter()


@router.get("/")
async def get_opportunities(
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)

    opportunities = await service.get_all()

    # Return raw list of opportunity objects (not wrapped), to match frontend expectations
    return [OpportunityResponse.model_validate(o) for o in opportunities]


@router.get("/{opportunity_id}")
async def get_opportunity(
    opportunity_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)

    opportunity = await service.get(opportunity_id)

    return OpportunityResponse.model_validate(opportunity)


@router.post("/")
async def create_opportunity(
    data: OpportunityCreate,
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)

    opportunity = await service.create(data)

    return OpportunityResponse.model_validate(opportunity)


@router.put("/{opportunity_id}")
async def update_opportunity(
    opportunity_id: UUID,
    data: OpportunityUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)

    opportunity = await service.update(
        opportunity_id,
        data,
    )

    return OpportunityResponse.model_validate(opportunity)


@router.delete("/{opportunity_id}")
async def delete_opportunity(
    opportunity_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)

    await service.delete(opportunity_id)

    return success_response(
        message="Opportunity deleted successfully",
    )

@router.get("/{opportunity_id}/mentors")
async def get_opportunity_mentors(
    opportunity_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)
    mentors = await service.get_mentors(opportunity_id)
    return [OpportunityMentorResponse.model_validate(m) for m in mentors]

@router.post("/{opportunity_id}/mentors")
async def assign_opportunity_mentor(
    opportunity_id: UUID,
    data: OpportunityMentorCreate,
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)
    mentor = await service.assign_mentor(opportunity_id, data.mentor_profile_id)
    return OpportunityMentorResponse.model_validate(mentor)

@router.delete("/{opportunity_id}/mentors/{employee_id}")
async def remove_opportunity_mentor(
    opportunity_id: UUID,
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = OpportunityService(db)
    from app.core.responses import success_response
    await service.remove_mentor(opportunity_id, employee_id)
    return success_response(message="Mentor removed successfully")