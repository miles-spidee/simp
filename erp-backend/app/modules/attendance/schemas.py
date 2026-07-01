from pydantic import BaseModel
from uuid import UUID

class AttendanceBase(BaseModel):
    pass

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: UUID
    class Config:
        from_attributes = True
