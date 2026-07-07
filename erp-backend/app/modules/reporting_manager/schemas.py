from __future__ import annotations
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel


class RMBatchResponse(BaseModel):
    batch_id: UUID
    batch_name: str
    batch_code: str
    program_id: UUID
    program_name: str
    start_date: str
    end_date: str
    max_capacity: int
    student_count: int

    class Config:
        from_attributes = True


class RMStudentResponse(BaseModel):
    student_profile_id: UUID
    user_id: Optional[UUID]
    enrollment_number: str
    name: str
    email: str
    phone: Optional[str]
    github_url: Optional[str]
    linkedin_url: Optional[str]

    class Config:
        from_attributes = True


class RMMentorResponse(BaseModel):
    mentor_profile_id: UUID
    user_id: Optional[UUID]
    name: str
    email: str
    expertise: Optional[str]
    years_of_experience: Optional[int]
    is_available: bool
    assigned_student_count: int

    class Config:
        from_attributes = True
