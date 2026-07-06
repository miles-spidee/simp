from __future__ import annotations
from typing import Any, Generic, TypeVar, Sequence, List, Dict, Optional, Tuple
from uuid import UUID
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel as PydanticBaseModel
from sqlalchemy import select, update, delete, asc, desc, or_, func, String
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
        filters: Dict[str, Any] = None,
        security_filter: Optional[Any] = None
    ) -> Sequence[ModelType]:
        stmt = select(self.model)
        if hasattr(self.model, 'deleted_at'):
            stmt = stmt.filter(getattr(self.model, 'deleted_at').is_(None))

        if filters:
            for k, v in filters.items():
                if hasattr(self.model, k):
                    stmt = stmt.filter(getattr(self.model, k) == v)
                    
        if security_filter:
            stmt = await security_filter(stmt, db)

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
        filters: Dict[str, Any] = None,
        security_filter: Optional[Any] = None
    ) -> Tuple[Sequence[ModelType], int]:
        """
        Return (items, total_count) using a **single query** with a window
        function instead of a separate COUNT subquery.

        Performance improvement
        -----------------------
        Old approach:
            1. SELECT COUNT(*) FROM (SELECT … full data query …) — round-trip #1
            2. SELECT … data … LIMIT/OFFSET                       — round-trip #2
        
        New approach (window function):
            SELECT *, count(*) OVER() AS _total FROM … LIMIT/OFFSET — 1 round-trip
        
        Each eliminated DB round-trip saves ~200 ms on AWS RDS from India.
        """
        # ── Base filter ────────────────────────────────────────────────────
        stmt = select(self.model)
        if hasattr(self.model, 'deleted_at'):
            stmt = stmt.filter(getattr(self.model, 'deleted_at').is_(None))

        # ── Equality filters ───────────────────────────────────────────────
        if filters:
            for k, v in filters.items():
                if hasattr(self.model, k) and v is not None:
                    stmt = stmt.filter(getattr(self.model, k) == v)

        # ── Full-text search ───────────────────────────────────────────────
        if search and self.search_fields:
            search_filters = []
            for field in self.search_fields:
                if hasattr(self.model, field):
                    col = getattr(self.model, field)
                    search_filters.append(col.cast(String).ilike(f"%{search}%"))
            if search_filters:
                stmt = stmt.filter(or_(*search_filters))

        # ── Sorting ────────────────────────────────────────────────────────
        if sort_by and hasattr(self.model, sort_by):
            col = getattr(self.model, sort_by)
            stmt = stmt.order_by(desc(col) if sort_order == "desc" else asc(col))

        if security_filter:
            stmt = await security_filter(stmt, db)

        # ── Single-pass COUNT via window function ──────────────────────────
        # We add a window-function column so Postgres counts in one pass.
        count_col = func.count().over().label("_total_count")
        stmt_with_count = stmt.add_columns(count_col)

        skip = (page - 1) * page_size
        stmt_with_count = stmt_with_count.offset(skip).limit(page_size)

        try:
            result = await db.execute(stmt_with_count)
            rows = result.all()
            if not rows:
                return [], 0
            # Each row is (ModelInstance, total_count)
            items = [row[0] for row in rows]
            total = rows[0][1]
            return items, total
        except Exception:
            # Fallback to the safer two-query approach if window function
            # fails for any model (e.g., complex joins).
            count_stmt = select(func.count()).select_from(stmt.subquery())
            total = await db.scalar(count_stmt) or 0

            data_stmt = stmt.offset(skip).limit(page_size)
            result = await db.execute(data_stmt)
            return result.scalars().all(), total

    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType | dict) -> ModelType:
        if isinstance(obj_in, PydanticBaseModel):
            obj_in_data = {
                key: value
                for key, value in obj_in.model_dump(exclude_none=True).items()
                if hasattr(self.model, key)
            }
        elif isinstance(obj_in, dict):
            obj_in_data = {key: value for key, value in obj_in.items() if hasattr(self.model, key)}
        else:
            obj_in_data = jsonable_encoder(obj_in)

        if self.model.__name__ == "Program":
            if "department_id" not in obj_in_data or obj_in_data.get("department_id") is None:
                from app.models.organizations.department import Department
                result = await db.execute(select(Department.id).limit(1))
                department_id = result.scalar_one_or_none()
                if department_id is not None:
                    obj_in_data["department_id"] = department_id

            code = obj_in_data.get("code")
            department_id = obj_in_data.get("department_id")
            if code and department_id is not None:
                candidate_code = code
                suffix = 2
                while True:
                    existing = await db.execute(
                        select(self.model.id).where(
                            self.model.department_id == department_id,
                            self.model.code == candidate_code,
                        )
                    )
                    if existing.scalar_one_or_none() is None:
                        break
                    candidate_code = f"{code}-{suffix}"
                    suffix += 1
                obj_in_data["code"] = candidate_code

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
            update_data = {key: value for key, value in obj_in.items() if hasattr(db_obj, key)}
        else:
            update_data = {
                key: value
                for key, value in obj_in.model_dump(exclude_unset=True, exclude_none=True).items()
                if hasattr(db_obj, key)
            }

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
            from datetime import datetime, timezone
            obj.deleted_at = datetime.now(timezone.utc)
            db.add(obj)
        else:
            await db.delete(obj)
        await db.flush()
        return obj
