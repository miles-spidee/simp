from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    user_id: UUID
    email: EmailStr
    role_name: str
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True