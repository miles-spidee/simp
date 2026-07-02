from app.repositories.base import BaseRepository

from app.models.hr.leave import (
    LeaveBalance,
    LeaveRequest,
)

from app.modules.leave.schemas import (
    LeaveBalanceCreate,
    LeaveBalanceUpdate,
    LeaveRequestCreate,
    LeaveRequestUpdate,
)


class LeaveBalanceRepository(
    BaseRepository[
        LeaveBalance,
        LeaveBalanceCreate,
        LeaveBalanceUpdate,
    ]
):
    def __init__(self):
        super().__init__(
            LeaveBalance,
            search_fields=[
                "leave_type",
            ],
        )


class LeaveRequestRepository(
    BaseRepository[
        LeaveRequest,
        LeaveRequestCreate,
        LeaveRequestUpdate,
    ]
):
    def __init__(self):
        super().__init__(
            LeaveRequest,
            search_fields=[
                "leave_type",
                "status",
            ],
        )