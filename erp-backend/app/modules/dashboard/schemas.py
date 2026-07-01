from pydantic import BaseModel
from uuid import UUID

class DashboardBase(BaseModel):
    pass

class DashboardCreate(DashboardBase):
    pass

class DashboardUpdate(DashboardBase):
    pass

class DashboardResponse(DashboardBase):
    id: UUID
    class Config:
        from_attributes = True
