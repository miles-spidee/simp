from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.auth_deps import get_current_user, RequireRole
from .schemas import UserLogin, TokenResponse, UserResponse
from .service import AuthService

# Assumed imports from DB team
from app.db_team_package.database import get_db_session
from app.db_team_package.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db_session)):
    """Validates credentials and returns JWTs for the frontend."""
    service = AuthService(db)
    return await service.authenticate_user(credentials)

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Returns the profile of the currently authenticated user."""
    return current_user

# --- Example of how you will use RBAC in other modules ---
@router.post("/trigger-escalation", dependencies=[Depends(RequireRole(["Super Admin", "HR"]))])
async def trigger_escalation():
    """Only Super Admins and HR can hit this endpoint."""
    return {"message": "Escalation triggered successfully."}