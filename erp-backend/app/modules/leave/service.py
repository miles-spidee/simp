from datetime import timedelta
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.base import BaseService

from app.models.hr.leave import (
    LeaveBalance,
    LeaveRequest,
)

from app.modules.leave.repository import (
    LeaveBalanceRepository,
    LeaveRequestRepository,
)

from app.modules.leave.schemas import (
    LeaveBalanceCreate,
    LeaveBalanceUpdate,
    LeaveRequestCreate,
    LeaveRequestUpdate,
)


class LeaveService(BaseService):

    def __init__(self, db: AsyncSession):
        super().__init__(db)

        self.balance_repo = LeaveBalanceRepository()
        self.request_repo = LeaveRequestRepository()

    # ==========================================================
    # LEAVE BALANCE
    # ==========================================================

    async def get_leave_balances(self):
        balances, _ = await self.balance_repo.get_paginated(
            self.db,
            page=1,
            page_size=5000,
        )
        return balances

    async def create_leave_balance(
        self,
        data: LeaveBalanceCreate,
        user_id: UUID,
    ):

        balance = await self.balance_repo.create(
            self.db,
            obj_in=data,
        )

        await self.log_audit_event(
            action="CREATE_LEAVE_BALANCE",
            entity="LeaveBalance",
            user_id=user_id,
            new_value=str(balance.id),
        )

        await self.commit_transaction()

        return balance

    async def update_leave_balance(
        self,
        balance_id: UUID,
        data: LeaveBalanceUpdate,
        user_id: UUID,
    ):

        balance = await self.balance_repo.get(
            self.db,
            balance_id,
        )

        if not balance:
            raise HTTPException(
                status_code=404,
                detail="Leave balance not found",
            )

        balance = await self.balance_repo.update(
            self.db,
            db_obj=balance,
            obj_in=data,
        )

        await self.log_audit_event(
            action="UPDATE_LEAVE_BALANCE",
            entity="LeaveBalance",
            user_id=user_id,
            new_value=str(balance.id),
        )

        await self.commit_transaction()

        return balance

    # ==========================================================
    # LEAVE REQUEST
    # ==========================================================

    async def get_leave_requests(self):

        requests, _ = await self.request_repo.get_paginated(
            self.db,
            page=1,
            page_size=5000,
        )

        return requests

    async def create_leave_request(
        self,
        data: LeaveRequestCreate,
        user_id: UUID,
    ):

        if data.end_date < data.start_date:
            raise HTTPException(
                status_code=400,
                detail="End date must be after start date",
            )

        balance_stmt = select(LeaveBalance).where(
            LeaveBalance.employee_profile_id == data.employee_profile_id,
            LeaveBalance.leave_type == data.leave_type,
        )

        balance = await self.db.scalar(balance_stmt)

        if not balance:
            raise HTTPException(
                status_code=404,
                detail="Leave balance not found",
            )

        requested_days = Decimal(
            (data.end_date - data.start_date).days + 1
        )

        available_days = (
            Decimal(balance.total_days)
            - Decimal(balance.used_days)
        )

        if requested_days > available_days:
            raise HTTPException(
                status_code=400,
                detail="Insufficient leave balance",
            )

        request = await self.request_repo.create(
            self.db,
            obj_in=data,
        )

        await self.log_audit_event(
            action="CREATE_LEAVE_REQUEST",
            entity="LeaveRequest",
            user_id=user_id,
            new_value=str(request.id),
        )

        await self.commit_transaction()

        return request

    async def update_leave_request(
        self,
        request_id: UUID,
        data: LeaveRequestUpdate,
        user_id: UUID,
    ):

        request = await self.request_repo.get(
            self.db,
            request_id,
        )

        if not request:
            raise HTTPException(
                status_code=404,
                detail="Leave request not found",
            )

        request = await self.request_repo.update(
            self.db,
            db_obj=request,
            obj_in=data,
        )

        await self.log_audit_event(
            action="UPDATE_LEAVE_REQUEST",
            entity="LeaveRequest",
            user_id=user_id,
            new_value=str(request.id),
        )

        await self.commit_transaction()

        return request

    # ==========================================================
    # APPROVE
    # ==========================================================

    async def approve_leave(
        self,
        request_id: UUID,
        approver_id: UUID,
    ):

        request = await self.request_repo.get(
            self.db,
            request_id,
        )

        if not request:
            raise HTTPException(
                status_code=404,
                detail="Leave request not found",
            )

        if request.status != "PENDING":
            raise HTTPException(
                status_code=400,
                detail="Leave request already processed",
            )

        balance_stmt = select(LeaveBalance).where(
            LeaveBalance.employee_profile_id == request.employee_profile_id,
            LeaveBalance.leave_type == request.leave_type,
        )

        balance = await self.db.scalar(balance_stmt)

        if not balance:
            raise HTTPException(
                status_code=404,
                detail="Leave balance not found",
            )

        days = Decimal(
            (request.end_date - request.start_date).days + 1
        )

        balance.used_days += days

        request.status = "APPROVED"
        request.approved_by_user_id = approver_id

        self.db.add(balance)
        self.db.add(request)

        await self.log_audit_event(
            action="APPROVE_LEAVE",
            entity="LeaveRequest",
            user_id=approver_id,
            new_value=str(request.id),
        )

        await self.commit_transaction()

        return request

    # ==========================================================
    # REJECT
    # ==========================================================

    async def reject_leave(
        self,
        request_id: UUID,
        approver_id: UUID,
    ):

        request = await self.request_repo.get(
            self.db,
            request_id,
        )

        if not request:
            raise HTTPException(
                status_code=404,
                detail="Leave request not found",
            )

        if request.status != "PENDING":
            raise HTTPException(
                status_code=400,
                detail="Leave request already processed",
            )

        request.status = "REJECTED"
        request.approved_by_user_id = approver_id

        self.db.add(request)

        await self.log_audit_event(
            action="REJECT_LEAVE",
            entity="LeaveRequest",
            user_id=approver_id,
            new_value=str(request.id),
        )

        await self.commit_transaction()

        return request