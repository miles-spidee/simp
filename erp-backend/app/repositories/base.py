from typing import Any, Generic, TypeVar, Sequence, List, Dict, Optional, Tuple
from uuid import UUID
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel as PydanticBaseModel
from sqlalchemy import select, update, delete, asc, desc, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.core.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=PydanticBaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=PydanticBaseModel)

class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: type[ModelType], search_fields: List[str] = None):
        self.model = model
        self.search_fields = search_fields or []

    async def get(self, db: AsyncSession, id: Any) -> ModelType | None:
        stmt = select(self.model).filter(self.model.id == id)
        if hasattr(self.model, 'deleted_at'):
            stmt = stmt.filter(getattr(self.model, 'deleted_at').is_(None))
        result = await db.execute(stmt)
        return result.scalars().first()

    async def get_multi(
        self, 
        db: AsyncSession, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters: Dict[str, Any] = None
    ) -> Sequence[ModelType]:
        stmt = select(self.model)
        if hasattr(self.model, 'deleted_at'):
            stmt = stmt.filter(getattr(self.model, 'deleted_at').is_(None))
            
        if filters:
            for k, v in filters.items():
                if hasattr(self.model, k):
                    stmt = stmt.filter(getattr(self.model, k) == v)
        stmt = stmt.offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_paginated(
        self,
        db: AsyncSession,
        *,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        sort_by: Optional[str] = "created_at",
        sort_order: Optional[str] = "desc",
        filters: Dict[str, Any] = None
    ) -> Tuple[Sequence[ModelType], int]:
        stmt = select(self.model)
        
        # Base filter: Exclude soft-deleted records if applicable
        if hasattr(self.model, 'deleted_at'):
            stmt = stmt.filter(getattr(self.model, 'deleted_at').is_(None))
            
        # Filtering
        if filters:
            for k, v in filters.items():
                if hasattr(self.model, k) and v is not None:
                    stmt = stmt.filter(getattr(self.model, k) == v)
                    
        # Searching
        if search and self.search_fields:
            search_filters = []
            for field in self.search_fields:
                if hasattr(self.model, field):
                    col = getattr(self.model, field)
                    # ilike for string fields
                    search_filters.append(col.cast(String).ilike(f"%{search}%")) if hasattr(col.type, 'length') else search_filters.append(col.cast(String).ilike(f"%{search}%"))
            if search_filters:
                from sqlalchemy import String
                stmt = stmt.filter(or_(*search_filters))
                
        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await db.scalar(count_stmt)
        
        # Sorting
        if sort_by and hasattr(self.model, sort_by):
            col = getattr(self.model, sort_by)
            stmt = stmt.order_by(desc(col) if sort_order == "desc" else asc(col))
            
        # Pagination
        skip = (page - 1) * page_size
        stmt = stmt.offset(skip).limit(page_size)
        
        result = await db.execute(stmt)
        return result.scalars().all(), total

    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType | dict) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in) if not isinstance(obj_in, dict) else obj_in
        db_obj = self.model(**obj_in_data)  # type: ignore
        db.add(db_obj)
        # Flush to get the ID, but don't commit to allow caller to handle transactions
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: UpdateSchemaType | dict[str, Any]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
            
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
                
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: UUID) -> ModelType | None:
        obj = await db.get(self.model, id)
        if not obj:
            return None
            
        if hasattr(obj, 'deleted_at'):
            from datetime import datetime, UTC
            obj.deleted_at = datetime.now(UTC)
            db.add(obj)
        else:
            await db.delete(obj)
        await db.flush()
        return obj
