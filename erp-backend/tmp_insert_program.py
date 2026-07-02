import asyncio

from app.core.database import AsyncSessionLocal
from app.modules.program.repository import ProgramRepository
from app.modules.program.schemas import ProgramCreate

async def main():
    payload = ProgramCreate(
        program_name='sfgh',
        program_code='sdfghj',
        internship_type_id='',
        program_description='',
        duration_weeks=8,
        certificate_available=True,
        status='DRAFT'
    )
    async with AsyncSessionLocal() as db:
        repo = ProgramRepository()
        try:
            obj = await repo.create(db, obj_in=payload)
            print('created', obj)
            await db.commit()
        except Exception as e:
            await db.rollback()
            print(type(e).__name__, e)


asyncio.run(main())
