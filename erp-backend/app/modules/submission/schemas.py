from pydantic import BaseModel
from uuid import UUID

class SubmissionBase(BaseModel):
    pass

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(SubmissionBase):
    pass

class SubmissionResponse(SubmissionBase):
    id: UUID
    class Config:
        from_attributes = True
