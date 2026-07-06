from typing import Optional, Dict, Any, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request

from app.models.academic.program import Program
from app.modules.program.repository import ProgramRepository
from app.modules.program.schemas import ProgramCreate, ProgramUpdate
from app.services.base import BaseCRUDService
from app.core.schemas import SearchParams, PaginatedResponse
from app.models.authentication.user import User

class ProgramService(BaseCRUDService[Program, ProgramCreate, ProgramUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, ProgramRepository())

    async def get_multi(
        self, *, skip: int = 0, limit: int = 100, filters: Dict[str, Any] = None, current_user: Optional[User] = None
    ) -> Sequence[Program]:
        async def security_filter(stmt, db):
            from app.core.security_filters import apply_program_filter
            return await apply_program_filter(stmt, db, current_user, self.repository.model)
        
        return await super().get_multi(
            skip=skip, limit=limit, filters=filters, security_filter=security_filter if current_user else None
        )
        
    async def search_paginated(
        self, params: SearchParams, filters: Dict[str, Any] = None, current_user: Optional[User] = None
    ) -> PaginatedResponse:
        async def security_filter(stmt, db):
            from app.core.security_filters import apply_program_filter
            return await apply_program_filter(stmt, db, current_user, self.repository.model)
            
        return await super().search_paginated(
            params=params, filters=filters, security_filter=security_filter if current_user else None
        )
