from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.services.base import BaseService
from app.modules.identity.repository import UserRepository, PermissionRepository
from app.modules.identity.schemas import (
    LoginRequest, RegisterRequest, Token, LogoutRequest, RefreshRequest,
    ChangePasswordRequest, ForgotPasswordRequest, ForgotPasswordVerify, ResetPasswordRequest
)
from app.core.security import verify_password, hash_password, create_access_token, create_refresh_token
from app.models.authentication.user import User
from app.models.core.enums import StatusEnum

class IdentityService(BaseService):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.user_repo = UserRepository(db)
        self.permission_repo = PermissionRepository(db)

    async def login(self, data: LoginRequest) -> dict:
        user = await self.user_repo.get_by_email_or_username(self.db, data.username)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        if user.account_status != StatusEnum.ACTIVE.value:
            raise HTTPException(status_code=403, detail="Account is inactive")
            
        from datetime import datetime, timezone
        if user.account_expires_at and user.account_expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="User not found")
            
        from app.models.rbac.user_role import UserRole
        from app.models.rbac.role import Role
        from sqlalchemy import select
        
        result = await self.db.execute(
            select(Role.code)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == user.id)
        )
        role_code = result.scalars().first() or "STUDENT"
        
        access_token = create_access_token(user.id, role_code, user.email)
        refresh_token = create_refresh_token(user.id)
        
        # Log audit event for login
        await self.log_audit_event("LOGIN", "User", user.id, new_value={"ip": "127.0.0.1"})
        
        # Send Login OTP notification (SMS only)
        if user.phone:
            try:
                from app.services.notification_service import notification_service
                await notification_service.send_login_otp(user.phone, "123456")
            except Exception:
                pass
                
        await self.commit_transaction()
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "role": role_code
            }
        }

    async def register(self, data: RegisterRequest) -> dict:
        user = await self.user_repo.get_by_email(self.db, data.email)
        if user:
            raise HTTPException(status_code=409, detail="Email already registered")
            
        new_user = User(
            username=data.email,
            email=data.email,
            password_hash=hash_password(data.password),
            account_status=StatusEnum.ACTIVE.value
        )
        self.db.add(new_user)
        # We must flush to get the ID for audit
        await self.db.flush()
        
        # Audit creation
        await self.log_audit_event("REGISTER", "User", new_user.id)
        
        # Send Welcome notification (Email, In-App)
        try:
            from app.services.notification_service import notification_service
            await notification_service.send_welcome_notif(new_user.username, new_user.email)
        except Exception:
            pass
            
        # Finalize transaction
        await self.commit_transaction()
        
    async def logout(self, data: LogoutRequest, user_id: UUID) -> dict:
        # In a real setup, we would blacklist the refresh_token here
        await self.log_audit_event("LOGOUT", "User", user_id)
        await self.commit_transaction()
        return {"success": True}

    async def refresh(self, data: RefreshRequest) -> dict:
        # Pseudo-logic: decode refresh token, ensure it's valid and not blacklisted
        # Then generate new access token
        return {"access_token": "new-token", "refresh_token": "new-refresh-token", "token_type": "Bearer"}

    async def change_password(self, data: ChangePasswordRequest, user_id: UUID) -> dict:
        user = await self.user_repo.get(self.db, user_id)
        if not user or not verify_password(data.old_password, user.password_hash):
            raise HTTPException(status_code=400, detail="Invalid old password")
            
        user.password_hash = hash_password(data.new_password)
        user.force_password_change = False
        self.db.add(user)
        
        await self.log_audit_event("CHANGE_PASSWORD", "User", user_id)
        await self.commit_transaction()
        
        return {"success": True}

    async def forgot_password(self, data: ForgotPasswordRequest) -> dict:
        target = data.email or data.username
        if not target:
            return {
                "success": False,
                "message": "Username or email is required."
            }
        user = await self.user_repo.get_by_email_or_username(self.db, target)

        if user:
            await self.log_audit_event(
                "FORGOT_PASSWORD_REQUEST",
                "User",
                user.id
            )
            
            # Send Password Reset notification (Email, SMS)
            try:
                from app.services.notification_service import notification_service
                await notification_service.send_password_reset_otp(user.email, user.phone or "+919876543210", "654321")
            except Exception:
                pass
                
            await self.commit_transaction()

        return {
            "success": True,
            "message": "If an account exists, a password reset OTP has been sent."
        }
                
        # Always return success to prevent email enumeration
    async def verify_reset_otp(self, data: ForgotPasswordVerify) -> dict:
        # Pseudo-logic: Validate OTP against token in Redis/DB
        return {"success": True, "message": "OTP verified successfully. Proceed to reset password."}

    async def reset_password(self, data: ResetPasswordRequest) -> dict:
        target = data.username or data.token
        if not target:
            return {"success": False, "message": "Username or reset token is required."}
            
        user = await self.user_repo.get_by_email_or_username(self.db, target)
        if not user:
            return {"success": False, "message": "User not found."}
            
        new_pass = data.newPassword or data.new_password
        if not new_pass:
            return {"success": False, "message": "New password is required."}
            
        user.password_hash = hash_password(new_pass)
        self.db.add(user)
        await self.log_audit_event("PASSWORD_RESET", "User", user.id)
        await self.commit_transaction()
        
        return {"success": True, "message": "Password has been successfully reset."}
