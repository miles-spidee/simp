from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import verify_password, create_access_token, create_refresh_token
from .schemas import UserLogin, TokenResponse

# Assumed import from the DB team's package
from app.db_team_package.models import User 

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate_user(self, credentials: UserLogin) -> TokenResponse:
        # Querying the DB team's User model
        stmt = select(User).where(User.email == credentials.email)
        result = await self.db.execute(stmt)
        user = result.scalars().first()
        
        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user account")

        # Assuming the DB team set up the relation: user.role.name
        token_payload = {"sub": str(user.id), "role": user.role.name}
        
        return TokenResponse(
            access_token=create_access_token(token_payload),
            refresh_token=create_refresh_token(token_payload)
        )