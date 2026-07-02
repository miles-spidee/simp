from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.organizations.department import Department
from app.modules.program.service import ProgramService
from app.modules.program.schemas import ProgramCreate

router = APIRouter()

@router.get("/")
async def get_programs(
    db: AsyncSession = Depends(get_db)
):
    service = ProgramService(db)

    programs = await service.get_multi()

    return [
        {
            "program_id": str(p.id),
            "internship_type_id": p.program_type,
            "program_code": p.code,
            "program_name": p.name,
            "program_description": p.description,
            "duration_weeks": p.duration_months * 4,
            "certificate_available": False,
            "status": "Active",
        }
        for p in programs
    ]

@router.post("/", status_code=201)
async def create_program(
    payload: ProgramCreate,
    db: AsyncSession = Depends(get_db),
):
    if payload.department_id is None:
        result = await db.execute(select(Department.id).limit(1))
        department_id = result.scalar_one_or_none()
        if department_id is None:
            raise HTTPException(status_code=400, detail="No department is available to assign to this program")
        payload.department_id = department_id

    service = ProgramService(db)

    program = await service.create(obj_in=payload)

    return {
        "program_id": str(program.id),
        "internship_type_id": program.program_type,
        "program_code": program.code,
        "program_name": program.name,
        "program_description": program.description,
        "duration_weeks": program.duration_months * 4,
        "certificate_available": False,
        "status": "Active",
    }