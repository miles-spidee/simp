from __future__ import annotations

from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ------------------------------------------------------------------
# Create
# ------------------------------------------------------------------

class AllocationCreate(BaseModel):
    student_profile_id: UUID
    mentor_profile_id: UUID
    opportunity_id: Optional[UUID] = None

    start_date: date
    end_date: Optional[date] = None

    status: str = Field(default="ACTIVE", max_length=50)


# ------------------------------------------------------------------
# Update
# ------------------------------------------------------------------

class AllocationUpdate(BaseModel):
    mentor_profile_id: Optional[UUID] = None
    opportunity_id: Optional[UUID] = None

    start_date: Optional[date] = None
    end_date: Optional[date] = None

    status: Optional[str] = Field(default=None, max_length=50)


# ------------------------------------------------------------------
# Response
# ------------------------------------------------------------------

class AllocationResponse(BaseModel):
    allocation_id: UUID

    student_profile_id: UUID
    mentor_profile_id: UUID
    opportunity_id: Optional[UUID]

    start_date: date
    end_date: Optional[date]

    status: str

    created_at: str
    updated_at: str

    class Config:
        from_attributes = True