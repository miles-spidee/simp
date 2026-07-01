from pydantic import BaseModel
from uuid import UUID

class PerformanceBase(BaseModel):
    pass

class PerformanceCreate(PerformanceBase):
    pass

class PerformanceUpdate(PerformanceBase):
    pass

class PerformanceResponse(PerformanceBase):
    id: UUID
    class Config:
        from_attributes = True
