from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal
from typing import Optional


class InternshipOpeningCreate(BaseModel):
    internship_type_id: UUID
    role_name: str
    role_description: Optional[str] = None
    project_title: Optional[str] = None
    duration_weeks: int
    stipend_amount: Optional[Decimal] = None
    fee_amount: Optional[Decimal] = None
    total_openings: int
    application_deadline: date
    status: str


class InternshipOpeningUpdate(BaseModel):
    role_name: Optional[str] = None
    role_description: Optional[str] = None
    project_title: Optional[str] = None
    duration_weeks: Optional[int] = None
    stipend_amount: Optional[Decimal] = None
    fee_amount: Optional[Decimal] = None
    total_openings: Optional[int] = None
    application_deadline: Optional[date] = None
    status: Optional[str] = None


class InternshipOpeningResponse(BaseModel):
    opening_id: UUID
    internship_type_id: UUID
    role_name: str
    role_description: Optional[str]
    project_title: Optional[str]
    duration_weeks: int
    stipend_amount: Optional[Decimal]
    fee_amount: Optional[Decimal]
    total_openings: int
    application_deadline: date
    status: str
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True