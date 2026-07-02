from __future__ import annotations

from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# ------------------------------------------------------------------
# Create
# ------------------------------------------------------------------

class BatchCreate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
    )

    program_id: UUID
    semester_id: Optional[UUID] = None

    name: str = Field(
        alias="batch_name",
        max_length=255,
    )

    code: str = Field(
        alias="batch_code",
        max_length=100,
    )

    start_date: date
    end_date: date

    max_capacity: int = Field(
        gt=0,
    )

    batch_status: Optional[str] = None


# ------------------------------------------------------------------
# Update
# ------------------------------------------------------------------

class BatchUpdate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
    )

    program_id: Optional[UUID] = None
    semester_id: Optional[UUID] = None

    name: Optional[str] = Field(
        default=None,
        alias="batch_name",
        max_length=255,
    )

    code: Optional[str] = Field(
        default=None,
        alias="batch_code",
        max_length=100,
    )

    start_date: Optional[date] = None
    end_date: Optional[date] = None

    max_capacity: Optional[int] = Field(
        default=None,
        gt=0,
    )

    batch_status: Optional[str] = None


# ------------------------------------------------------------------
# Response
# ------------------------------------------------------------------

class BatchResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    batch_id: UUID

    program_id: UUID
    semester_id: Optional[UUID]

    batch_name: str
    batch_code: str

    start_date: date
    end_date: date

    max_capacity: int

    created_at: str
    updated_at: str