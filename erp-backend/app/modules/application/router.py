from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User
from app.models.internships.application import Application

from app.modules.application.schemas import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationReviewRequest,
)
from app.modules.application.service import ApplicationService
from app.services.ai_evaluation import evaluate_application

router = APIRouter()


# -------------------------------------------------------
# Get All Applications
# -------------------------------------------------------

@router.get(
    "/",
    response_model=APIResponse[list[ApplicationResponse]]
)
async def get_application_list(
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)

    applications = await service.get_all()

    return success_response(data=applications)


# -------------------------------------------------------
# Get Single Application
# -------------------------------------------------------

@router.get(
    "/{application_id}",
    response_model=APIResponse[ApplicationResponse]
)
async def get_application(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)

    application = await service.get(application_id)
    return success_response(data=application)


# -------------------------------------------------------
# Create Application
# -------------------------------------------------------

@router.post(
    "/",
    response_model=APIResponse[ApplicationResponse]
)
async def create_application(
    data: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)

    try:
        application = await service.create(
            obj_in=data,
            user_id=None,
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e

    return success_response(
        data=application,
        message="Application submitted successfully",
    )

@router.get(
    "/me/list",
    response_model=APIResponse[list[ApplicationResponse]]
)
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)

    applications = await service.get_my_applications(current_user.id)

    return success_response(data=applications)

@router.get(
    "/admin/all",
    response_model=APIResponse[list[ApplicationResponse]]
)
async def get_all_admin(
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)

    applications = await service.get_all()

    return success_response(data=applications)



@router.patch(
    "/{application_id}/review",
    response_model=APIResponse[ApplicationResponse]
)
async def review_application(
    application_id: UUID,
    data: ApplicationReviewRequest,
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)

    application = await service.review(
        application_id=application_id,
        data=data,
    )

    return success_response(
        data=application,
        message="Application reviewed successfully",
    )

@router.patch(
    "/{application_id}/withdraw",
    response_model=APIResponse[ApplicationResponse]
)
async def withdraw_application(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = ApplicationService(db)

    application = await service.withdraw(application_id)

    return success_response(
        data=application,
        message="Application withdrawn successfully",
    )


# -------------------------------------------------------
# AI Evaluation — rule-based analysis
# -------------------------------------------------------

@router.get(
    "/{application_id}/ai-evaluate",
)
async def ai_evaluate_application(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Run the smart AI evaluation engine on a single application.
    Returns scores for sentiment, commitment, communication quality,
    match percentage, strengths, weaknesses, and suggested questions.
    """
    from sqlalchemy import select

    stmt = select(Application).where(Application.id == application_id)
    result = await db.execute(stmt)
    application = result.scalars().first()

    if not application:
        return success_response(data={}, message="Application not found")

    ai_data = evaluate_application({
        "application_data": application.application_data or {}
    })

    return success_response(data=ai_data, message="AI evaluation complete")