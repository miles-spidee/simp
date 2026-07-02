from __future__ import annotations

from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MentorProfileCreate(BaseModel):
    user_id: UUID
    employee_profile_id: Optional[UUID] = None

    expertise: Optional[str] = Field(default=None, max_length=255)
    years_of_experience: Optional[int] = None

    max_capacity: int = Field(default=10, gt=0)

    is_available: bool = True


class MentorProfileUpdate(BaseModel):
    employee_profile_id: Optional[UUID] = None

    expertise: Optional[str] = None
    years_of_experience: Optional[int] = None

    max_capacity: Optional[int] = Field(default=None, gt=0)

    is_available: Optional[bool] = None


class MentorProfileResponse(BaseModel):
    mentor_profile_id: UUID

    user_id: UUID
    employee_profile_id: Optional[UUID]

    expertise: Optional[str]
    years_of_experience: Optional[int]

    max_capacity: int
    is_available: bool

    created_at: str
    updated_at: str

    class Config:
        from_attributes = True