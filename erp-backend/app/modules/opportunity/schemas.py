from datetime import date
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class OpportunityCreate(BaseModel):
    project_title: str
    role_name: str
    role_description: str
    opening_status: str

    company_id: Optional[UUID] = None
    program_id: Optional[UUID] = None
    location: Optional[str] = None
    stipend: Optional[Decimal] = None
    fee: Optional[Decimal] = None
    duration_weeks: Optional[int] = None
    requirements: Optional[str] = None
    deadline: Optional[date] = None


class OpportunityUpdate(BaseModel):
    project_title: Optional[str] = None
    role_name: Optional[str] = None
    role_description: Optional[str] = None
    opening_status: Optional[str] = None

    location: Optional[str] = None
    stipend: Optional[Decimal] = None
    fee: Optional[Decimal] = None
    duration_weeks: Optional[int] = None
    requirements: Optional[str] = None
    deadline: Optional[date] = None


class OpportunityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_id: UUID
    program_id: Optional[UUID] = None

    title: str
    description: str

    location: Optional[str]
    stipend: Optional[Decimal]
    fee: Optional[Decimal]
    duration_weeks: Optional[int]
    requirements: Optional[str]
    status: str
    deadline: Optional[date]

class OpportunityMentorCreate(BaseModel):
    mentor_profile_id: UUID

class OpportunityMentorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    opportunity_id: UUID
    mentor_profile_id: UUID