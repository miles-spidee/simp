from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"

class LoginRequest(BaseModel):
    username: EmailStr
    password: str
    
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ForgotPasswordVerify(BaseModel):
    token: str
    otp: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class CurrentUserResponse(BaseModel):
    user_id: UUID
    name: str
    email: str
    roleName: str
    roleId: UUID
    roleCode: str
    modules: List[dict] = []
    permissions: List[str] = []

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    roleCode: Optional[str] = "STUDENT"

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class LogoutRequest(BaseModel):
    refresh_token: str


class DigiLockerStartRequest(BaseModel):
    student_profile_id: UUID


class DigiLockerStartResponse(BaseModel):
    authorization_url: str
    state: str


class DigiLockerCallbackResponse(BaseModel):
    student_profile_id: UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    mobile_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    aadhaar_verified: bool
    aadhaar_number: Optional[str] = None
    verification_date: str
