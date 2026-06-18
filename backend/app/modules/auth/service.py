from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token
)

from .schemas import (
    UserLogin,
    TokenResponse
)

from .models import (
    User,
    UserRole
)


class AuthService:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate_user(
        self,
        credentials: UserLogin
    ) -> TokenResponse:

        stmt = (
            select(User)
            .options(
                joinedload(User.user_role)
                .joinedload(UserRole.role)
            )
            .where(
                User.email == credentials.email
            )
        )

        result = await self.db.execute(stmt)

        user = result.scalars().first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not verify_password(
            credentials.password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not verified"
            )

        if not user.user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No role assigned to user"
            )

        if not user.user_role.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid role assignment"
            )

        role_name = user.user_role.role.role_name

        token_payload = {
            "sub": str(user.user_id),
            "role": role_name
        }

        return TokenResponse(
            access_token=create_access_token(token_payload),
            refresh_token=create_refresh_token(token_payload)
        )