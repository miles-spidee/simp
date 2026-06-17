from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class IndustrialApplicationDetailsCreate(BaseModel):
    application_id: UUID
    area_of_interest: str
    preferred_domain: str


class IndustrialApplicationDetailsUpdate(BaseModel):
    area_of_interest: Optional[str] = None
    preferred_domain: Optional[str] = None


class IndustrialApplicationDetailsResponse(BaseModel):
    industrial_application_id: UUID
    application_id: UUID
    area_of_interest: str
    preferred_domain: str

    class Config:
        from_attributes = True