from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """
    Decodes the JWT and returns the current user.
    Import this in any module that needs the logged-in user.
    """
    from app.core.config import settings
    from app.modules.identity.repository import UserRepository
    from app.models.core.enums import StatusEnum
    
    user = None
    if credentials:
        try:
            payload = decode_access_token(credentials.credentials)
            user = await UserRepository(db).get(db, payload["sub"])
        except Exception:
            pass

    if not user and settings.APP_ENV == "development":
        user = await UserRepository(db).get_by_email(db, "admin@pinesphere.example.com")

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    if user.account_status != StatusEnum.ACTIVE.value:
        raise HTTPException(status_code=403, detail="Account is inactive")

    return user


MODULE_MAPPING = {
    "users": "user",
    "roles": "role",
    "modules": "module_registry",
    "organizations": "organization",
    "programs": "program",
    "opportunities": "opportunity",
    "applications": "application",
    "students": "student",
    "files": "common_file",
}

def require_permission(module: str, action: str):
    """
    Reusable RBAC dependency factory.

    Usage in any router:
        current_user = Depends(require_permission("students", "read"))

    Checks: does this user's role have the permission '{module}:{action}'?
    """
    async def checker(
        current_user=Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
    ):
        from app.modules.identity.repository import PermissionRepository
        # Map read to view to match DB seed scripts
        mapped_action = "view" if action == "read" else action
        # Map router module name to DB module name
        mapped_module = MODULE_MAPPING.get(module, module)
        
        permission_name = f"{mapped_module}.{mapped_action}"
        has_perm = await PermissionRepository(db).user_has_permission(
            db=db,
            user_id=current_user.id,
            permission_name=permission_name,
        )
        if not has_perm:
            raise HTTPException(status_code=403, detail=f"Permission denied: {permission_name}")
        return current_user

    return checker
