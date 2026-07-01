from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseCRUDService
from app.modules.users.repository import UserRepository
from app.modules.users.schemas import UserCreate, UserUpdate
from app.models.authentication.user import User
from app.core.security import hash_password
from fastapi import HTTPException

class UserService(BaseCRUDService[User, UserCreate, UserUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, UserRepository())

    async def create(self, *, obj_in: UserCreate, user_id: UUID = None) -> User:
        # Business Workflow: Hash password before saving
        obj_in.password = hash_password(obj_in.password)
        return await super().create(obj_in=obj_in, user_id=user_id)
        
    async def update(self, *, id: UUID, obj_in: UserUpdate, user_id: UUID = None) -> User:
        if obj_in.password:
            obj_in.password = hash_password(obj_in.password)
        return await super().update(id=id, obj_in=obj_in, user_id=user_id)
        
    async def lock_account(self, id: UUID, user_id: UUID) -> User:
        # Business Workflow: Account Lockout
        user = await self.get(id)
        from app.models.core.enums import StatusEnum
        user.account_status = StatusEnum.SUSPENDED
        self.db.add(user)
        await self.log_audit_event("LOCK_ACCOUNT", "User", user_id, new_value=StatusEnum.SUSPENDED.value)
        await self.commit_transaction()
        return user
