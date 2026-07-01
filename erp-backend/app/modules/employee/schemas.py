from pydantic import BaseModel
from uuid import UUID

class EmployeeBase(BaseModel):
    pass

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: UUID
    class Config:
        from_attributes = True
