from __future__ import annotations

from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field


class MentorProfileCreate(BaseModel):
    employee_id: UUID
    employeeName: Optional[str] = None
    mentor_bio: Optional[str] = None
    mentor_expertise: List[str] = []
    years_of_experience: int
    max_student_capacity: int = 10
    is_available: bool = True


class MentorProfileUpdate(BaseModel):
    mentor_bio: Optional[str] = None
    mentor_expertise: Optional[List[str]] = None
    years_of_experience: Optional[int] = None
    max_student_capacity: Optional[int] = None
    is_available: Optional[bool] = None


class MentorProfileResponse(BaseModel):
    mentor_profile_id: UUID
    employee_id: str
    employeeName: str
    mentor_bio: str
    mentor_expertise: List[str]
    years_of_experience: int
    max_student_capacity: int
    current_student_count: int
    is_available: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class MentorAssignmentCreate(BaseModel):
    mentorProfileId: UUID
    studentId: UUID
    status: str = "Active"


class MentorBatchMappingCreate(BaseModel):
    mentorProfileId: UUID
    batchId: UUID
    status: str = "Active"