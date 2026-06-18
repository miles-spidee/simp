from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session

from app.dependencies.auth_deps import (
    get_current_user,
    RequireRole
)

from .schemas import (
    UserLogin,
    TokenResponse,
    UserResponse
)

from .service import AuthService

from .models import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)

    return await service.authenticate_user(
        credentials
    )


@router.get(
    "/me",
    response_model=UserResponse
)
async def get_my_profile(
    current_user: User = Depends(get_current_user)
):

    return UserResponse(
        user_id=current_user.user_id,
        email=current_user.email,
        role_name=current_user.user_role.role.role_name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified
    )


@router.post(
    "/test-admin",
    dependencies=[
        Depends(
            RequireRole(
                [
                    "Super Admin",
                    "HR"
                ]
            )
        )
    ]
)
async def test_admin_access():

    return {
        "message": "Authorized"
    }