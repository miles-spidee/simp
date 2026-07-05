from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict


# ----------------------------
# Create / Update
# ----------------------------

# class ApplicationBase(BaseModel):
#     opportunity_id: UUID
#     student_profile_id: UUID


class ApplicationCreate(BaseModel):
    first_name: str
    last_name: str

    email: EmailStr
    mobile_number: str

    opening_id: UUID

    resume_url: str | None = None

    model_config = ConfigDict(extra='allow')

class ApplicationReviewRequest(BaseModel):
    application_status: str
    remarks: str | None = None
    technical_score: int | None = None
    communication_score: int | None = None
    academic_score: int | None = None
    culture_fit_score: int | None = None
    overall_recommendation: str | None = None
    reviewer_notes: str | None = None
    reviewer_feedback: str | None = None
    amount_paid: float | None = None
    payment_verified: str | None = None



class ApplicationUpdate(BaseModel):
    status: str | None = None
    feedback: str | None = None


# ----------------------------
# Profile Response
# ----------------------------

class ApplicationProfileResponse(BaseModel):
    first_name: str
    last_name: str
    email: str
    mobile_number: str


# ----------------------------
# Response
# ----------------------------

class ApplicationResponse(BaseModel):
    application_id: UUID
    opening_id: UUID
    applicant_user_id: UUID

    application_status: str

    applied_at: datetime
    reviewed_at: datetime | None

    reviewed_by: str
    remarks: str | None

    profile: ApplicationProfileResponse

    application_data: dict | None = None
    review_data: dict | None = None

    class Config:
        from_attributes = True
   