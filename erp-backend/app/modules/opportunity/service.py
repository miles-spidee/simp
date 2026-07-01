from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.modules.opportunity.repository import OpportunityRepository
from app.modules.opportunity.schemas import OpportunityCreate, OpportunityUpdate

class OpportunityService(BaseService):
    def __init__(self, db: AsyncSession):
        repo = OpportunityRepository(db)
        super().__init__(repo)
