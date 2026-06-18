from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID4
    email: EmailStr
    role_name: str
    is_active: bool

    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy model objects