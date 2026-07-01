from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.responses import success_response, APIResponse
from app.models.authentication.user import User
from app.modules.application.schemas import ApplicationCreate, ApplicationResponse
from app.modules.application.service import ApplicationService

router = APIRouter()

@router.get("/", response_model=APIResponse[list[ApplicationResponse]])
async def get_application_list(db: AsyncSession = Depends(get_db)):
    return success_response(data=[])


@router.post("/", response_model=APIResponse[ApplicationResponse])
async def create_application(
    data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)
    application = await service.create(data, user_id=current_user.id)
    response = ApplicationResponse.model_validate(application)
    return success_response(data=response, message="Application submitted successfully")
