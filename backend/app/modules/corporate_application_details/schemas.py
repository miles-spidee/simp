from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class CorporateApplicationDetailsCreate(BaseModel):
    application_id: UUID
    team_collaboration_experience: str
    leadership_experience: str


class CorporateApplicationDetailsUpdate(BaseModel):
    team_collaboration_experience: Optional[str] = None
    leadership_experience: Optional[str] = None


class CorporateApplicationDetailsResponse(BaseModel):
    corporate_application_id: UUID
    application_id: UUID
    team_collaboration_experience: str
    leadership_experience: str

    class Config:
        from_attributes = True