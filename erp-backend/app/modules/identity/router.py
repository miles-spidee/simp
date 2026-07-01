from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.responses import success_response, APIResponse
from app.modules.identity.schemas import (
    LoginRequest, RegisterRequest, CurrentUserResponse, 
    RefreshRequest, LogoutRequest, ChangePasswordRequest, 
    ForgotPasswordRequest, ForgotPasswordVerify, ResetPasswordRequest
    , DigiLockerStartRequest, DigiLockerStartResponse, DigiLockerCallbackResponse
)
from app.modules.identity.service import IdentityService
from app.models.authentication.user import User
from app.services.digilocker_service import DigiLockerService

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
    from app.models.rbac.feature import Feature
    from app.models.rbac.permission import Permission
    from app.models.rbac.role_permission import RolePermission
    from app.models.rbac.user_module import UserModule
    from sqlalchemy import or_
    
    db_modules = []
    if role and role.code == "SUPER_ADMIN":
        module_result = await db.execute(select(Module))
        db_modules = module_result.scalars().all()
    else:
        role_module_ids_query = (
            select(Module.id)
            .join(Feature, Feature.module_id == Module.id)
            .join(Permission, Permission.feature_id == Feature.id)
            .join(RolePermission, RolePermission.permission_id == Permission.id)
            .where(RolePermission.role_id == role.id)
        ) if role else select(Module.id).where(False)
        
        user_module_ids_query = select(UserModule.module_id).where(UserModule.user_id == current_user.id)
        
        combined_module_ids_query = select(Module).where(
            or_(
                Module.id.in_(role_module_ids_query),
                Module.id.in_(user_module_ids_query)
            )
        )
        module_result = await db.execute(combined_module_ids_query)
        db_modules = module_result.scalars().all()
        
    mapped_modules = [
        {
            "id": m.code, # Map DB code to frontend ID
            "code": m.code.upper(),
            "name": m.name,
            "description": m.description or "",
            "icon": "",
            "route": m.path or "",
            "status": "ACTIVE",
            "features": []
        }
        for m in db_modules
    ]
    
    permissions = []
    if role and role.code == "SUPER_ADMIN":
        permissions = ["all"]
    else:
        # Temporarily auto-grant frontend permissions for assigned modules
        for m in mapped_modules:
            mod_id = m["id"]
            permissions.extend([
                f"{mod_id}.view",
                f"{mod_id}.create",
                f"{mod_id}.update",
                f"{mod_id}.delete",
                f"{mod_id}.manage",
                f"{mod_id}.export"
            ])
            # Special cases from FEATURE_REGISTRY
            if mod_id == 'lms_management':
                permissions.append('lms.create')
            elif mod_id == 'attendance_management':
                permissions.append('attendance.mark')
            elif mod_id == 'task_management':
                permissions.append('task.create')
            elif mod_id == 'assessment_management':
                permissions.append('assessment.create')
            elif mod_id == 'finance_analytics':
                permissions.append('analytics.finance.view')
            elif mod_id == 'college_certificates':
                permissions.append('certificate.view')
        
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


@router.post("/digilocker/start", response_model=APIResponse[DigiLockerStartResponse])
async def digilocker_start(
    data: DigiLockerStartRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = DigiLockerService(db)
    result = service.build_authorization_url(
        user_id=str(current_user.id),
        student_profile_id=str(data.student_profile_id),
    )
    return success_response(data=result, message="DigiLocker authorization URL generated")


@router.get("/digilocker/callback", response_model=APIResponse[DigiLockerCallbackResponse])
async def digilocker_callback(
    code: str = Query(...),
    state: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    service = DigiLockerService(db)
    result = await service.handle_callback(code=code, state=state)
    return success_response(data=result, message="Aadhaar verified successfully")

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
