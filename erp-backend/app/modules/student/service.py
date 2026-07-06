from typing import Optional, Dict, Any, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseCRUDService
from app.modules.student.repository import StudentRepository
from app.modules.student.schemas import StudentCreate, StudentUpdate
from app.models.profiles.student_profile import StudentProfile
from app.core.schemas import SearchParams, PaginatedResponse
from app.models.authentication.user import User

class StudentService(BaseCRUDService[StudentProfile, StudentCreate, StudentUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db=db, repository=StudentRepository(db))

    async def get_multi(
        self, *, skip: int = 0, limit: int = 100, filters: Dict[str, Any] = None, current_user: Optional[User] = None
    ) -> Sequence[StudentProfile]:
        async def security_filter(stmt, db):
            from app.core.security_filters import apply_student_filter
            return await apply_student_filter(stmt, db, current_user, self.repository.model)
        
        return await super().get_multi(
            skip=skip, limit=limit, filters=filters, security_filter=security_filter if current_user else None
        )
        
    async def search_paginated(
        self, params: SearchParams, filters: Dict[str, Any] = None, current_user: Optional[User] = None
    ) -> PaginatedResponse:
        async def security_filter(stmt, db):
            from app.core.security_filters import apply_student_filter
            return await apply_student_filter(stmt, db, current_user, self.repository.model)
            
        return await super().search_paginated(
            params=params, filters=filters, security_filter=security_filter if current_user else None
        )
