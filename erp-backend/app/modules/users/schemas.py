from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from app.models.core.enums import StatusEnum

class UserCreate(BaseModel):
    username: str
    email: str
    password: str = "ChangeMe@123"
    account_status: StatusEnum = StatusEnum.ACTIVE
    roleId: Optional[UUID] = None
    moduleOverrides: list[UUID] = []
    entityType: Optional[str] = None # 'employee', 'student', 'organization'
    entityId: Optional[UUID] = None
    sendEmail: Optional[bool] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    account_status: Optional[StatusEnum] = None
    password: Optional[str] = None
    roleId: Optional[UUID] = None
    moduleOverrides: Optional[list[UUID]] = None

class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    account_status: StatusEnum
    roleName: Optional[str] = None
    roleId: Optional[UUID] = None
