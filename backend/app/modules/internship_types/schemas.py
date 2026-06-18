from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime


class InternshipTypeCreate(BaseModel):
    type_code: str
    type_name: str
    description: Optional[str] = None


class InternshipTypeUpdate(BaseModel):
    type_name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class InternshipTypeResponse(BaseModel):
    internship_type_id: UUID
    type_code: str
    type_name: str
    description: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True