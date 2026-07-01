from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from app.models.core.enums import StatusEnum

class UserCreate(BaseModel):
    username: str
    email: str
    password: str = "ChangeMe@123"
    account_status: StatusEnum = StatusEnum.ACTIVE

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    account_status: Optional[StatusEnum] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    account_status: StatusEnum
