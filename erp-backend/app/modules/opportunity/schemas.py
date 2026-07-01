from pydantic import BaseModel
from uuid import UUID

class OpportunityBase(BaseModel):
    pass

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(OpportunityBase):
    pass

class OpportunityResponse(OpportunityBase):
    id: UUID
    class Config:
        from_attributes = True
