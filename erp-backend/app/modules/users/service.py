from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseCRUDService
from app.modules.users.repository import UserRepository
from app.modules.users.schemas import UserCreate, UserUpdate
from app.models.authentication.user import User
from app.core.security import hash_password
from fastapi import HTTPException

class UserService(BaseCRUDService[User, UserCreate, UserUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, UserRepository())

    async def create(self, *, obj_in: UserCreate, user_id: UUID = None) -> User:
        # Business Workflow: Hash password before saving
        obj_in_data = obj_in.model_dump(exclude_unset=True)
        password = obj_in_data.pop("password", "ChangeMe@123")
        send_email = obj_in_data.pop("sendEmail", False)
        obj_in_data["password_hash"] = hash_password(password)
        role_id = obj_in_data.pop("roleId", None)
        module_overrides = obj_in_data.pop("moduleOverrides", [])
        
        # Ensure account_status is set since exclude_unset=True drops defaults
        account_status = obj_in_data.get("account_status", obj_in.account_status)
        obj_in_data["account_status"] = account_status.value if hasattr(account_status, "value") else account_status
        
        force_password_change = obj_in_data.pop("forcePasswordChange", False)
        obj_in_data["force_password_change"] = force_password_change
        
        account_validation_period = obj_in_data.pop("accountValidationPeriod", None)
        if account_validation_period:
            from datetime import datetime, timedelta, timezone
            obj_in_data["account_expires_at"] = datetime.now(timezone.utc) + timedelta(days=account_validation_period)
        # Explicit check for existing email or username
        from sqlalchemy import select
        existing_user = await self.db.scalar(
            select(User).where(
                (User.email == obj_in_data["email"]) | (User.username == obj_in_data["username"])
            )
        )
        if existing_user:
            raise HTTPException(status_code=400, detail="A user with this email or username already exists")
            
        entity_type = obj_in_data.pop("entityType", None)
        entity_id = obj_in_data.pop("entityId", None)
            
        new_user = await super().create(obj_in=obj_in_data, user_id=user_id)
        
        # Assign role if provided
        if role_id:
            from app.models.rbac.user_role import UserRole
            user_role = UserRole(user_id=new_user.id, role_id=role_id, created_by=user_id)
            self.db.add(user_role)
            
        # Assign explicit module overrides
        if module_overrides:
            from app.models.rbac.user_module import UserModule
            for mod_id in module_overrides:
                user_mod = UserModule(user_id=new_user.id, module_id=mod_id, created_by=user_id)
                self.db.add(user_mod)
                
        if role_id or module_overrides:
            await self.db.flush()
            
        if entity_type and entity_id:
            from sqlalchemy import select
            
            if entity_type == "employee":
                from app.models.profiles.employee_profile import EmployeeProfile
                profile = await self.db.scalar(select(EmployeeProfile).where(EmployeeProfile.id == entity_id))
            elif entity_type == "student":
                from app.models.profiles.student_profile import StudentProfile
                profile = await self.db.scalar(select(StudentProfile).where(StudentProfile.id == entity_id))
            elif entity_type == "organization":
                from app.models.organizations.organization import Organization
                profile = await self.db.scalar(select(Organization).where(Organization.id == entity_id))
            else:
                raise HTTPException(status_code=400, detail="Invalid entityType")
                
            if not profile:
                raise HTTPException(status_code=404, detail="Entity not found")
                
            if getattr(profile, "user_id", None) is not None:
                raise HTTPException(status_code=400, detail="Entity already linked to a user account")
                
            profile.user_id = new_user.id
            self.db.add(profile)
            
        await self.commit_transaction()
        
        # Send credentials via email if requested
        if send_email:
            try:
                from app.services.notification_service import notification_service
                await notification_service.send_credentials_email(new_user.email, new_user.username, password)
            except Exception as e:
                print("Error sending credentials email:", e)
            
        return new_user
    async def update(self, *, id: UUID, obj_in: UserUpdate, user_id: UUID = None) -> User:
        obj_in_data = obj_in.model_dump(exclude_unset=True)
        
        role_id = obj_in_data.pop("roleId", None)
        module_overrides = obj_in_data.pop("moduleOverrides", None)
        
        if "password" in obj_in_data:
            password = obj_in_data.pop("password")
            obj_in_data["password_hash"] = hash_password(password)
            
        if "account_status" in obj_in_data:
            status = obj_in_data["account_status"]
            obj_in_data["account_status"] = status.value if hasattr(status, "value") else status
            
        updated_user = await super().update(id=id, obj_in=obj_in_data, user_id=user_id)
        
        needs_commit = False
        from sqlalchemy import delete
        
        if role_id is not None:
            from app.models.rbac.user_role import UserRole
            await self.db.execute(delete(UserRole).where(UserRole.user_id == id))
            new_user_role = UserRole(user_id=id, role_id=role_id, created_by=user_id)
            self.db.add(new_user_role)
            needs_commit = True
            
        if module_overrides is not None:
            from app.models.rbac.user_module import UserModule
            await self.db.execute(delete(UserModule).where(UserModule.user_id == id))
            for mod_id in module_overrides:
                new_user_mod = UserModule(user_id=id, module_id=mod_id, created_by=user_id)
                self.db.add(new_user_mod)
            needs_commit = True
            
        if needs_commit:
            await self.commit_transaction()
            
        return updated_user
        
    async def lock_account(self, id: UUID, user_id: UUID) -> User:
        # Business Workflow: Account Lockout
        user = await self.get(id)
        from app.models.core.enums import StatusEnum
        user.account_status = StatusEnum.SUSPENDED
        self.db.add(user)
        await self.log_audit_event("LOCK_ACCOUNT", "User", user_id, new_value=StatusEnum.SUSPENDED.value)
        await self.commit_transaction()
        return user

    async def delete(self, *, id: UUID, user_id: UUID = None) -> User:
        user = await self.get(id)
        if user and not user.deleted_at:
            import time
            suffix = f"_deleted_{int(time.time())}"
            user.email = (user.email[:200] + suffix) if len(user.email) > 200 else (user.email + suffix)
            user.username = (user.username[:50] + suffix) if len(user.username) > 50 else (user.username + suffix)
            self.db.add(user)
            await self.db.flush()
        return await super().delete(id=id, user_id=user_id)
