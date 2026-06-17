from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class ResearchApplicationDetailsCreate(BaseModel):
    application_id: UUID
    research_area_of_interest: str
    research_interest_statement: str
    publications_available: bool
    publication_links: Optional[str] = None


class ResearchApplicationDetailsUpdate(BaseModel):
    research_area_of_interest: Optional[str] = None
    research_interest_statement: Optional[str] = None
    publications_available: Optional[bool] = None
    publication_links: Optional[str] = None


class ResearchApplicationDetailsResponse(BaseModel):
    research_application_id: UUID
    application_id: UUID
    research_area_of_interest: str
    research_interest_statement: str
    publications_available: bool
    publication_links: Optional[str]

    class Config:
        from_attributes = True