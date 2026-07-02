from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ==========================================================
# LEAVE BALANCE
# ==========================================================

class LeaveBalanceCreate(BaseModel):
    employee_profile_id: UUID
    leave_type: str = Field(..., max_length=50)

    total_days: Decimal
    used_days: Decimal = Decimal("0.00")


class LeaveBalanceUpdate(BaseModel):
    leave_type: Optional[str] = Field(default=None, max_length=50)

    total_days: Optional[Decimal] = None
    used_days: Optional[Decimal] = None


class LeaveBalanceResponse(BaseModel):
    leave_balance_id: UUID

    employee_profile_id: UUID
    leave_type: str

    total_days: Decimal
    used_days: Decimal
    available_days: Decimal

    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# ==========================================================
# LEAVE REQUEST
# ==========================================================

class LeaveRequestCreate(BaseModel):
    employee_profile_id: UUID

    leave_type: str = Field(..., max_length=50)

    start_date: date
    end_date: date

    reason: str


class LeaveRequestUpdate(BaseModel):
    leave_type: Optional[str] = Field(default=None, max_length=50)

    start_date: Optional[date] = None
    end_date: Optional[date] = None

    reason: Optional[str] = None


class LeaveRequestResponse(BaseModel):
    leave_request_id: UUID

    employee_profile_id: UUID

    leave_type: str

    start_date: date
    end_date: date

    reason: str

    status: str

    approved_by_user_id: Optional[UUID]

    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# ==========================================================
# APPROVE / REJECT
# ==========================================================

class LeaveApprovalRequest(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED)$")