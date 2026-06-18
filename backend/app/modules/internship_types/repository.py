from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import InternshipType


class InternshipTypeRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        stmt = select(InternshipType)

        result = await self.db.execute(stmt)

        return result.scalars().all()

    async def get_by_id(
        self,
        internship_type_id: UUID
    ):
        stmt = select(InternshipType).where(
            InternshipType.internship_type_id == internship_type_id
        )

        result = await self.db.execute(stmt)

        return result.scalars().first()

    async def create(
        self,
        payload
    ):
        internship_type = InternshipType(
            type_code=payload.type_code,
            type_name=payload.type_name,
            description=payload.description
        )

        self.db.add(internship_type)

        await self.db.commit()

        await self.db.refresh(internship_type)

        return internship_type

    async def update(
        self,
        internship_type_id: UUID,
        payload
    ):
        internship_type = await self.get_by_id(
            internship_type_id
        )

        if not internship_type:
            return None

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(
                internship_type,
                key,
                value
            )

        await self.db.commit()

        await self.db.refresh(
            internship_type
        )

        return internship_type

    async def delete(
        self,
        internship_type_id: UUID
    ):
        internship_type = await self.get_by_id(
            internship_type_id
        )

        if not internship_type:
            return None

        await self.db.delete(
            internship_type
        )

        await self.db.commit()

        return {
            "message": "Internship Type deleted successfully"
        }