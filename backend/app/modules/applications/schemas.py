from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class ApplicationCreate(BaseModel):
    opening_id: UUID


class ApplicationUpdate(BaseModel):
    application_status: Optional[str] = None
    remarks: Optional[str] = None


class ApplicationResponse(BaseModel):
    application_id: UUID
    opening_id: UUID
    applicant_id: UUID
    application_status: str
    submitted_at: datetime
    remarks: Optional[str]

    class Config:
        from_attributes = True