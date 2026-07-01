from pydantic import BaseModel
from uuid import UUID

class AssessmentBase(BaseModel):
    pass

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentUpdate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: UUID
    class Config:
        from_attributes = True
