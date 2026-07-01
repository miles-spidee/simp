from pydantic import BaseModel
from uuid import UUID

class ApplicationBase(BaseModel):
    opportunity_id: UUID
    student_profile_id: UUID

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: UUID
    status: str | None = None
    class Config:
        from_attributes = True
