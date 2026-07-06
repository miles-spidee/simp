from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.internships.opportunity import Opportunity
from app.modules.opportunity.schemas import (
    OpportunityCreate,
    OpportunityUpdate,
)


class OpportunityRepository(
    BaseRepository[
        Opportunity,
        OpportunityCreate,
        OpportunityUpdate,
    ]
):
    def __init__(self):
        super().__init__(
            Opportunity,
            search_fields=["title", "location", "status"]
        )

    async def get_all(
        self,
        db: AsyncSession,
    ):
        result = await db.execute(
            select(Opportunity)
            .where(Opportunity.deleted_at.is_(None))
            .order_by(Opportunity.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id(
        self,
        db: AsyncSession,
        opportunity_id,
    ):
        result = await db.execute(
            select(Opportunity).where(
                Opportunity.id == opportunity_id
            )
        )
        return result.scalars().first()