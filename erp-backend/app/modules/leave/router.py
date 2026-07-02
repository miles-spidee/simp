from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User

from app.modules.leave.schemas import (
    LeaveBalanceCreate,
    LeaveBalanceUpdate,
    LeaveBalanceResponse,
    LeaveRequestCreate,
    LeaveRequestUpdate,
    LeaveRequestResponse,
)

from app.modules.leave.service import LeaveService

router = APIRouter()


# ==========================================================
# Helper Functions
# ==========================================================

def balance_response(balance):

    return LeaveBalanceResponse(
        leave_balance_id=balance.id,
        employee_profile_id=balance.employee_profile_id,
        leave_type=balance.leave_type,
        total_days=balance.total_days,
        used_days=balance.used_days,
        available_days=Decimal(balance.total_days) - Decimal(balance.used_days),
        created_at=balance.created_at.isoformat() if balance.created_at else "",
        updated_at=balance.updated_at.isoformat() if balance.updated_at else "",
    )


def request_response(request):

    return LeaveRequestResponse(
        leave_request_id=request.id,
        employee_profile_id=request.employee_profile_id,
        leave_type=request.leave_type,
        start_date=request.start_date,
        end_date=request.end_date,
        reason=request.reason,
        status=request.status,
        approved_by_user_id=request.approved_by_user_id,
        created_at=request.created_at.isoformat() if request.created_at else "",
        updated_at=request.updated_at.isoformat() if request.updated_at else "",
    )


# ==========================================================
# Leave Balance
# ==========================================================

@router.get(
    "/balances",
    response_model=APIResponse[list[LeaveBalanceResponse]],
)
async def get_leave_balances(
    current_user: User = Depends(require_permission("leave", "read")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    balances = await service.get_leave_balances()

    return success_response(
        data=[balance_response(b) for b in balances]
    )


@router.post(
    "/balances",
    response_model=APIResponse[LeaveBalanceResponse],
)
async def create_leave_balance(
    payload: LeaveBalanceCreate,
    current_user: User = Depends(require_permission("leave", "create")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    balance = await service.create_leave_balance(
        payload,
        current_user.id,
    )

    return success_response(
        data=balance_response(balance),
        message="Leave balance created successfully",
    )


@router.put(
    "/balances/{balance_id}",
    response_model=APIResponse[LeaveBalanceResponse],
)
async def update_leave_balance(
    balance_id: UUID,
    payload: LeaveBalanceUpdate,
    current_user: User = Depends(require_permission("leave", "update")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    balance = await service.update_leave_balance(
        balance_id,
        payload,
        current_user.id,
    )

    return success_response(
        data=balance_response(balance),
        message="Leave balance updated successfully",
    )


# ==========================================================
# Leave Request
# ==========================================================

@router.get(
    "/requests",
    response_model=APIResponse[list[LeaveRequestResponse]],
)
async def get_leave_requests(
    current_user: User = Depends(require_permission("leave", "read")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    requests = await service.get_leave_requests()

    return success_response(
        data=[request_response(r) for r in requests]
    )


@router.post(
    "/requests",
    response_model=APIResponse[LeaveRequestResponse],
)
async def create_leave_request(
    payload: LeaveRequestCreate,
    current_user: User = Depends(require_permission("leave", "create")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    request = await service.create_leave_request(
        payload,
        current_user.id,
    )

    return success_response(
        data=request_response(request),
        message="Leave request submitted successfully",
    )


@router.put(
    "/requests/{request_id}",
    response_model=APIResponse[LeaveRequestResponse],
)
async def update_leave_request(
    request_id: UUID,
    payload: LeaveRequestUpdate,
    current_user: User = Depends(require_permission("leave", "update")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    request = await service.update_leave_request(
        request_id,
        payload,
        current_user.id,
    )

    return success_response(
        data=request_response(request),
        message="Leave request updated successfully",
    )


# ==========================================================
# Approval
# ==========================================================

@router.post(
    "/requests/{request_id}/approve",
    response_model=APIResponse[LeaveRequestResponse],
)
async def approve_leave(
    request_id: UUID,
    current_user: User = Depends(require_permission("leave", "approve")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    request = await service.approve_leave(
        request_id,
        current_user.id,
    )

    return success_response(
        data=request_response(request),
        message="Leave approved successfully",
    )


@router.post(
    "/requests/{request_id}/reject",
    response_model=APIResponse[LeaveRequestResponse],
)
async def reject_leave(
    request_id: UUID,
    current_user: User = Depends(require_permission("leave", "approve")),
    db: AsyncSession = Depends(get_db),
):

    service = LeaveService(db)

    request = await service.reject_leave(
        request_id,
        current_user.id,
    )

    return success_response(
        data=request_response(request),
        message="Leave rejected successfully",
    )