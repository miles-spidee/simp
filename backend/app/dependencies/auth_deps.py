from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

import jwt

from app.core.config import settings

# Assumed imports from the DB team
from app.db_team_package.models import User
from app.db_team_package.database import get_db_session

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db_session)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")

        token_type = payload.get("type")

        if user_id is None:
            raise credentials_exception

        if token_type != "access":
            raise credentials_exception

    except jwt.PyJWTError:
        raise credentials_exception

    stmt = (
        select(User)
        .options(
            joinedload(User.user_role)
            .joinedload("role")
        )
        .where(
            User.user_id == user_id
        )
    )

    result = await db.execute(stmt)

    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise credentials_exception

    return user


class RequireRole:

    def __init__(
        self,
        allowed_roles: list[str]
    ):
        self.allowed_roles = allowed_roles

    async def __call__(
        self,
        current_user: User = Depends(get_current_user)
    ):

        role_name = (
            current_user
            .user_role
            .role
            .role_name
        )

        if role_name not in self.allowed_roles:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions."
            )

        return current_user