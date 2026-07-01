from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """
    Decodes the JWT and returns the current user.
    Import this in any module that needs the logged-in user.
    """
    try:
        payload = decode_access_token(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc))

    from app.modules.identity.repository import UserRepository
    user = await UserRepository(db).get(db, payload["sub"])

    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    from app.models.core.enums import StatusEnum
    if user.account_status != StatusEnum.ACTIVE:
        raise HTTPException(status_code=403, detail="Account is inactive")

    return user


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
        permission_name = f"{module}:{action}"
        has_perm = await PermissionRepository(db).user_has_permission(
            db=db,
            user_id=current_user.id,
            permission_name=permission_name,
        )
        if not has_perm:
            raise HTTPException(status_code=403, detail=f"Permission denied: {permission_name}")
        return current_user

    return checker
