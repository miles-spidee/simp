from __future__ import annotations
from typing import Any, Generic, TypeVar, Sequence, Dict, Optional
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.core.base import Base
from app.core.schemas import PaginatedResponse, SearchParams
from pydantic import BaseModel as PydanticBaseModel
import math

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=PydanticBaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=PydanticBaseModel)

class BaseService:
    """
    Foundation service class. Provides transaction and audit helpers.
    """
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def commit_transaction(self):
        from sqlalchemy.exc import IntegrityError
        from fastapi import HTTPException
        try:
            await self.db.commit()
        except IntegrityError as e:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail="Database integrity error: This record already exists or violates a constraint.")
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    async def execute_with_integrity_check(self, coro):
        from sqlalchemy.exc import IntegrityError
        from fastapi import HTTPException
        try:
            return await coro
        except IntegrityError as e:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Database integrity error: {str(e)}")
        except HTTPException:
            raise
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    async def log_audit_event(self, action: str, entity: str, user_id: UUID, new_value: Any = None, old_value: Any = None):
        from app.core.audit import log_audit_event as create_audit_log
        await create_audit_log(
            db=self.db,
            action=action,
            entity=entity,
            user_id=user_id,
            new_value=new_value,
            old_value=old_value
        )

class BaseCRUDService(BaseService, Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Base CRUD service building on the BaseService to provide standard operations.
    """
    def __init__(self, db: AsyncSession, repository: BaseRepository[ModelType, CreateSchemaType, UpdateSchemaType]):
        super().__init__(db)
        self.repository = repository

    async def get(self, id: Any) -> ModelType:
        obj = await self.repository.get(self.db, id)
        if not obj:
            raise HTTPException(status_code=404, detail="Item not found")
        return obj

    async def get_multi(
        self, *, skip: int = 0, limit: int = 100, filters: Dict[str, Any] = None
    ) -> Sequence[ModelType]:
        return await self.repository.get_multi(self.db, skip=skip, limit=limit, filters=filters)
        
    async def search_paginated(self, params: SearchParams, filters: Dict[str, Any] = None) -> PaginatedResponse:
        items, total = await self.repository.get_paginated(
            self.db,
            page=params.page,
            page_size=params.page_size,
            search=params.search,
            sort_by=params.sort_by,
            sort_order=params.sort_order,
            filters=filters
        )
        total_pages = math.ceil(total / params.page_size) if total > 0 else 1
        return PaginatedResponse(
            items=items,
            total=total,
            page=params.page,
            page_size=params.page_size,
            total_pages=total_pages
        )

    async def create(self, *, obj_in: CreateSchemaType, user_id: Optional[UUID] = None) -> ModelType:
        obj = await self.execute_with_integrity_check(self.repository.create(self.db, obj_in=obj_in))
        if user_id:
            await self.log_audit_event("CREATE", self.repository.model.__name__, user_id, new_value=obj.id)
        await self.commit_transaction()
        return obj

    async def update(
        self, *, id: Any, obj_in: UpdateSchemaType | dict[str, Any], user_id: Optional[UUID] = None
    ) -> ModelType:
        db_obj = await self.get(id)
        obj = await self.execute_with_integrity_check(self.repository.update(self.db, db_obj=db_obj, obj_in=obj_in))
        if user_id:
            await self.log_audit_event("UPDATE", self.repository.model.__name__, user_id, new_value=obj.id)
        await self.commit_transaction()
        return obj

    async def delete(self, *, id: UUID, user_id: Optional[UUID] = None) -> ModelType:
        obj = await self.execute_with_integrity_check(self.repository.delete(self.db, id=id))
        if not obj:
            raise HTTPException(status_code=404, detail="Item not found")
        if user_id:
            await self.log_audit_event("DELETE", self.repository.model.__name__, user_id, old_value=id)
        await self.commit_transaction()
        return obj
