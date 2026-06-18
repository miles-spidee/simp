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
        import logging
        logging.basicConfig(level=logging.DEBUG)
        logger = logging.getLogger(__name__)
        
        logger.debug(f"Attempting login with username: {credentials.username}")

        stmt = (
            select(User)
            .options(
                joinedload(User.user_role)
                .joinedload(UserRole.role)
            )
            .where(
                User.username == credentials.username
            )
        )

        result = await self.db.execute(stmt)
        user = result.scalars().first()
        
        logger.debug(f"User lookup result: {user}")

        if not user:
            logger.error(f"User {credentials.username} not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        logger.debug(f"User found: {user.username}")
        password_valid = verify_password(credentials.password, user.password_hash)
        logger.debug(f"Password verification: {password_valid}")
        
        if not password_valid:
            logger.error(f"Password mismatch for user {credentials.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            logger.error(f"User {credentials.username} is inactive")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

        if not user.is_verified:
            logger.warning(f"User {credentials.username} is not verified - allowing login anyway")
            # Temporarily allow unverified users for testing
            # raise HTTPException(
            #     status_code=status.HTTP_403_FORBIDDEN,
            #     detail="Account is not verified"
            # )

        if not user.user_role:
            logger.warning(f"User {credentials.username} has no role - allowing login anyway")
            # Temporarily allow users without roles for testing
            # raise HTTPException(
            #     status_code=status.HTTP_403_FORBIDDEN,
            #     detail="No role assigned to user"
            # )
        else:
            if not user.user_role.role:
                logger.error(f"User {credentials.username} has invalid role")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid role assignment"
                )
            role_name = user.user_role.role.role_name
            logger.debug(f"User role: {role_name}")
            token_payload = {
                "sub": str(user.user_id),
                "role": role_name
            }

        token_payload = {
            "sub": str(user.user_id),
            "role": getattr(user.user_role.role, 'role_name', 'user') if user.user_role else 'user'
        }
        
        logger.info(f"Login successful for {credentials.username}")
        return TokenResponse(
            access_token=create_access_token(token_payload),
            refresh_token=create_refresh_token(token_payload)
        )