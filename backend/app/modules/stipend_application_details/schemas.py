from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class StipendApplicationDetailsCreate(BaseModel):
    application_id: UUID
    relevant_experience: str


class StipendApplicationDetailsUpdate(BaseModel):
    relevant_experience: Optional[str] = None


class StipendApplicationDetailsResponse(BaseModel):
    stipend_application_id: UUID
    application_id: UUID
    relevant_experience: str

    class Config:
        from_attributes = True