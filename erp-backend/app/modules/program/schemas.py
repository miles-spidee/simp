from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


class ProgramBase(BaseModel):
    department_id: Optional[UUID] = None
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    duration_months: Optional[int] = None
    program_type: Optional[str] = None


class ProgramCreate(ProgramBase):
    internship_type_id: Optional[str] = None
    program_name: Optional[str] = None
    program_code: Optional[str] = None
    program_description: Optional[str] = None
    duration_weeks: Optional[int] = None
    certificate_available: Optional[bool] = None
    status: Optional[str] = None

    @model_validator(mode="after")
    def normalize_frontend_payload(self):
        if self.program_name and not self.name:
            self.name = self.program_name
        if self.program_code and not self.code:
            self.code = self.program_code
        if self.program_description and not self.description:
            self.description = self.program_description
        if self.duration_weeks is not None and self.duration_months is None:
            self.duration_months = max(1, (self.duration_weeks + 3) // 4)
        if self.internship_type_id and not self.program_type:
            self.program_type = self.internship_type_id
        if self.program_type is None:
            self.program_type = "Degree"
        if self.duration_months is None:
            self.duration_months = 3
        if self.name is None:
            self.name = "New Program"
        if self.code is None:
            self.code = "PROGRAM"
        return self


class ProgramUpdate(ProgramBase):
    department_id: Optional[UUID] = None
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    duration_months: Optional[int] = None
    program_type: Optional[str] = None


class ProgramResponse(ProgramBase):
    id: UUID

    class Config:
        from_attributes = True