from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.core.enums import StatusEnum

class CollegeCreate(BaseModel):
    college_name: str
    college_code: str
    college_email: Optional[str] = None
    college_phone: Optional[str] = None
    website_url: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    accreditation: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class CollegeUpdate(BaseModel):
    college_name: Optional[str] = None
    college_code: Optional[str] = None
    college_email: Optional[str] = None
    college_phone: Optional[str] = None
    website_url: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    accreditation: Optional[str] = None
    status: Optional[str] = None
    nba_status: Optional[str] = None
    autonomous_status: Optional[str] = None
    naac_grade: Optional[str] = None
    national_ranking: Optional[int] = None

class CollegeResponse(BaseModel):
    college_id: UUID
    college_name: str
    college_code: str
    college_email: Optional[str]
    college_phone: Optional[str]
    website_url: Optional[str]
    address_line_1: Optional[str]
    address_line_2: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    postal_code: Optional[str]
    accreditation: Optional[str]
    status: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class DepartmentCreate(BaseModel):
    college_id: UUID
    department_name: str
    department_code: str
    hod_name: Optional[str] = None
    department_email: Optional[str] = None

class DepartmentUpdate(BaseModel):
    department_name: Optional[str] = None
    department_code: Optional[str] = None
    hod_name: Optional[str] = None
    students_count: Optional[int] = None
    faculty_count: Optional[int] = None
    internships_count: Optional[int] = None
    placement_rate: Optional[float] = None
    status: Optional[str] = None

class DepartmentResponse(BaseModel):
    department_id: UUID
    college_id: UUID
    department_code: str
    department_name: str
    hod_name: Optional[str]
    department_email: Optional[str]
    status: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class CoordinatorCreate(BaseModel):
    college_id: UUID
    coordinator_name: str
    coordinator_email: str
    coordinator_phone: Optional[str] = None
    department: Optional[str] = None

class CoordinatorUpdate(BaseModel):
    coordinator_name: Optional[str] = None
    coordinator_phone: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None

class CoordinatorResponse(BaseModel):
    coordinator_id: UUID
    college_id: UUID
    coordinator_name: str
    coordinator_email: str
    coordinator_phone: Optional[str]
    department: Optional[str]
    status: str
    students_managed: int
    programs_managed: int
    kpis: dict

    class Config:
        from_attributes = True
