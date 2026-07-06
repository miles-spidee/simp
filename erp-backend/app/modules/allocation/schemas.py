from __future__ import annotations
from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class AllocationCreate(BaseModel):
    source_type: str = Field(..., max_length=50)
    source_id: UUID
    target_type: str = Field(..., max_length=50)
    target_id: UUID
    role: str = Field(..., max_length=50)
    
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str = Field(default="ACTIVE", max_length=50)

class AllocationUpdate(BaseModel):
    end_date: Optional[date] = None
    status: Optional[str] = Field(default=None, max_length=50)

class AllocationResponse(BaseModel):
    id: UUID
    source_type: str
    source_id: UUID
    target_type: str
    target_id: UUID
    role: str
    start_date: str
    end_date: Optional[str] = None
    status: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True