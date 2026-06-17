from pydantic import BaseModel, EmailStr
from uuid import UUID
from decimal import Decimal
from datetime import date
from typing import Optional


class ApplicationProfileCreate(BaseModel):
    application_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    mobile_number: str
    date_of_birth: date
    gender: str
    city: str
    state: str
    college_name: str
    department: str
    degree: str
    current_year: int
    cgpa_percentage: Decimal
    graduation_year: int
    skills: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    project_experience: Optional[str] = None
    motivation_statement: Optional[str] = None


class ApplicationProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile_number: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    college_name: Optional[str] = None
    department: Optional[str] = None
    degree: Optional[str] = None
    current_year: Optional[int] = None
    cgpa_percentage: Optional[Decimal] = None
    graduation_year: Optional[int] = None
    skills: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    project_experience: Optional[str] = None
    motivation_statement: Optional[str] = None


class ApplicationProfileResponse(BaseModel):
    application_profile_id: UUID
    application_id: UUID

    first_name: str
    last_name: str
    email: EmailStr
    mobile_number: str

    date_of_birth: date
    gender: str

    city: str
    state: str

    college_name: str
    department: str
    degree: str

    current_year: int
    cgpa_percentage: Decimal
    graduation_year: int

    skills: Optional[str]
    github_url: Optional[str]
    linkedin_url: Optional[str]
    portfolio_url: Optional[str]

    project_experience: Optional[str]
    motivation_statement: Optional[str]

    class Config:
        from_attributes = True