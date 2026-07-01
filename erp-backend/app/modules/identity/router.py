from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.responses import success_response, APIResponse
from app.modules.identity.schemas import (
    LoginRequest, RegisterRequest, CurrentUserResponse, 
    RefreshRequest, LogoutRequest, ChangePasswordRequest, 
    ForgotPasswordRequest, ForgotPasswordVerify, ResetPasswordRequest
)
from app.modules.identity.service import IdentityService
from app.models.authentication.user import User

router = APIRouter()

@router.post("/login", response_model=APIResponse[dict])
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = IdentityService(db)
    result = await service.login(data)
    return success_response(data=result, message="Login successful")

@router.post("/register", response_model=APIResponse[dict])
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    service = IdentityService(db)
    result = await service.register(data)
    return success_response(data=result, message="User registered successfully")

@router.get("/me", response_model=APIResponse[CurrentUserResponse])
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from app.models.rbac.user_role import UserRole
    from app.models.rbac.role import Role
    from sqlalchemy import select
    
    result = await db.execute(
        select(Role)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == current_user.id)
    )
    role = result.scalars().first()
    
    from app.models.rbac.module import Module
    
    # In a full implementation, we'd join UserRole -> Role -> RolePermission -> Permission -> Feature -> Module
    # For now, if the user is SUPER_ADMIN, return all seeded modules. Otherwise return empty.
    db_modules = []
    if role and role.code == "SUPER_ADMIN":
        module_result = await db.execute(select(Module))
        db_modules = module_result.scalars().all()
        
    mapped_modules = [
        {
            "id": m.code, # Map DB code to frontend ID
            "code": m.code.upper(),
            "name": m.name,
            "description": m.description or "",
            "icon": "",
            "route": "",
            "status": "ACTIVE",
            "features": []
        }
        for m in db_modules
    ]
    
    permissions = []
    if role and role.code == "SUPER_ADMIN":
        permissions = ["all"]
        
    user_data = CurrentUserResponse(
        user_id=current_user.id,
        name=current_user.username or "User",
        email=current_user.email,
        roleName=role.name if role else "Student",
        roleId=role.id if role else current_user.id,
        roleCode=role.code if role else "STUDENT",
        modules=mapped_modules,
        permissions=permissions
    )
    return success_response(data=user_data, message="Current user retrieved successfully")

@router.post("/refresh", response_model=APIResponse[dict])
async def refresh(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    service = IdentityService(db)
    result = await service.refresh(data)
    return success_response(data=result, message="Token refreshed")

@router.post("/logout", response_model=APIResponse[dict])
async def logout(
    data: LogoutRequest, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    service = IdentityService(db)
    result = await service.logout(data, current_user.id)
    return success_response(data=result, message="Logged out successfully")

@router.post("/change-password", response_model=APIResponse[dict])
async def change_password(
    data: ChangePasswordRequest, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    service = IdentityService(db)
    result = await service.change_password(data, current_user.id)
    return success_response(data=result, message="Password changed successfully")

@router.post("/forgot-password/request", response_model=APIResponse[dict])
async def forgot_password_request(
    data: ForgotPasswordRequest, 
    db: AsyncSession = Depends(get_db)
):
    service = IdentityService(db)
    result = await service.forgot_password(data)
    return success_response(data=result, message=result.get("message"))
@router.post("/forgot-password/verify", response_model=APIResponse[dict])
async def forgot_password_verify(
    data: ForgotPasswordVerify, 
    db: AsyncSession = Depends(get_db)
):
    service = IdentityService(db)
    result = await service.verify_reset_otp(data)
    return success_response(data=result, message=result.get("message"))

@router.post("/forgot-password/reset", response_model=APIResponse[dict])
async def forgot_password_reset(
    data: ResetPasswordRequest, 
    db: AsyncSession = Depends(get_db)
):
    service = IdentityService(db)
    result = await service.reset_password(data)
    return success_response(data=result, message=result.get("message"))
