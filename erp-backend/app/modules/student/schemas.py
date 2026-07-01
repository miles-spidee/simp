from pydantic import BaseModel
from uuid import UUID

class StudentBase(BaseModel):
    pass

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: UUID
    class Config:
        from_attributes = True
