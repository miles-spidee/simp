from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User
from app.modules.batch.schemas import (
    BatchCreate,
    BatchUpdate,
    BatchResponse,
)
from app.modules.batch.service import BatchService

router = APIRouter()

BATCH_INTERNSHIP_TYPES = {}


async def _get_program_details(db: AsyncSession, program_id: UUID):
    from app.models.academic.program import Program
    program = await db.get(Program, program_id)
    program_name = program.name if program else "Sample Program"
    internship_type = "Free Internship"
    if program:
        p_name = program.name.lower()
        if "paid" in p_name:
            internship_type = "Paid Internship"
        elif "stipend" in p_name:
            internship_type = "Stipend Internship"
        elif "industrial" in p_name:
            internship_type = "Industrial Internship"
        elif "research" in p_name:
            internship_type = "Research Internship"
        elif "corporate" in p_name:
            internship_type = "Corporate Internship"
        else:
            if "java" in p_name:
                internship_type = "Free Internship"
            else:
                internship_type = "Paid Internship"
    return program_name, internship_type


@router.get("", response_model=APIResponse[list[BatchResponse]])
async def get_batches(
    current_user: User = Depends(require_permission("batch", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = BatchService(db)
    batches = await service.get_multi(current_user=current_user)
    from app.models.academic.program import Program
    from sqlalchemy import select
    prog_ids = list({b.program_id for b in batches})
    programs_map = {}
    if prog_ids:
        prog_stmt = select(Program).where(Program.id.in_(prog_ids))
        prog_res = await db.execute(prog_stmt)
        programs_map = {p.id: p for p in prog_res.scalars().all()}

    data = []
    for batch in batches:
        program = programs_map.get(batch.program_id)
        program_name = program.name if program else "Sample Program"
        internship_type = "Free Internship"
        if program:
            p_name = program.name.lower()
            if "paid" in p_name:
                internship_type = "Paid Internship"
            elif "stipend" in p_name:
                internship_type = "Stipend Internship"
            elif "industrial" in p_name:
                internship_type = "Industrial Internship"
            elif "research" in p_name:
                internship_type = "Research Internship"
            elif "corporate" in p_name:
                internship_type = "Corporate Internship"
            else:
                if "java" in p_name:
                    internship_type = "Free Internship"
                else:
                    internship_type = "Paid Internship"

        data.append(
            BatchResponse(
                batch_id=batch.id,
                program_id=batch.program_id,
                semester_id=batch.semester_id,
                batch_name=batch.name,
                batch_code=batch.code,
                start_date=batch.start_date,
                end_date=batch.end_date,
                max_capacity=batch.max_capacity,
                program_name=program_name,
                internship_type=BATCH_INTERNSHIP_TYPES.get(str(batch.id)) or internship_type,
                created_at=batch.created_at.isoformat() if batch.created_at else "",
                updated_at=batch.updated_at.isoformat() if batch.updated_at else "",
            )
        )

    return success_response(data=data)


@router.get("/{batch_id}", response_model=APIResponse[BatchResponse])
async def get_batch(
    batch_id: UUID,
    current_user: User = Depends(require_permission("batch", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = BatchService(db)

    batch = await service.get(batch_id)

    program_name, internship_type = await _get_program_details(db, batch.program_id)

    response = BatchResponse(
        batch_id=batch.id,
        program_id=batch.program_id,
        semester_id=batch.semester_id,
        batch_name=batch.name,
        batch_code=batch.code,
        start_date=batch.start_date,
        end_date=batch.end_date,
        max_capacity=batch.max_capacity,
        program_name=program_name,
        internship_type=BATCH_INTERNSHIP_TYPES.get(str(batch.id)) or internship_type,
        created_at=batch.created_at.isoformat() if batch.created_at else "",
        updated_at=batch.updated_at.isoformat() if batch.updated_at else "",
    )

    return success_response(data=response)


@router.post("", response_model=APIResponse[BatchResponse])
async def create_batch(
    payload: BatchCreate,
    current_user: User = Depends(require_permission("batch", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = BatchService(db)

    batch = await service.create(
        obj_in=payload,
        user_id=current_user.id,
    )

    if payload.internship_type:
        BATCH_INTERNSHIP_TYPES[str(batch.id)] = payload.internship_type

    program_name, internship_type = await _get_program_details(db, batch.program_id)

    response = BatchResponse(
        batch_id=batch.id,
        program_id=batch.program_id,
        semester_id=batch.semester_id,
        batch_name=batch.name,
        batch_code=batch.code,
        start_date=batch.start_date,
        end_date=batch.end_date,
        max_capacity=batch.max_capacity,
        program_name=program_name,
        internship_type=BATCH_INTERNSHIP_TYPES.get(str(batch.id)) or internship_type,
        created_at=batch.created_at.isoformat() if batch.created_at else "",
        updated_at=batch.updated_at.isoformat() if batch.updated_at else "",
    )

    return success_response(
        data=response,
        message="Batch created successfully",
    )


@router.put("/{batch_id}", response_model=APIResponse[BatchResponse])
async def update_batch(
    batch_id: UUID,
    payload: BatchUpdate,
    current_user: User = Depends(require_permission("batch", "update")),
    db: AsyncSession = Depends(get_db),
):
    service = BatchService(db)

    batch = await service.update(
        id=batch_id,
        obj_in=payload,
        user_id=current_user.id,
    )

    if payload.internship_type:
        BATCH_INTERNSHIP_TYPES[str(batch.id)] = payload.internship_type

    program_name, internship_type = await _get_program_details(db, batch.program_id)

    response = BatchResponse(
        batch_id=batch.id,
        program_id=batch.program_id,
        semester_id=batch.semester_id,
        batch_name=batch.name,
        batch_code=batch.code,
        start_date=batch.start_date,
        end_date=batch.end_date,
        max_capacity=batch.max_capacity,
        program_name=program_name,
        internship_type=BATCH_INTERNSHIP_TYPES.get(str(batch.id)) or internship_type,
        created_at=batch.created_at.isoformat() if batch.created_at else "",
        updated_at=batch.updated_at.isoformat() if batch.updated_at else "",
    )

    return success_response(
        data=response,
        message="Batch updated successfully",
    )


@router.delete("/{batch_id}", response_model=APIResponse[dict])
async def delete_batch(
    batch_id: UUID,
    current_user: User = Depends(require_permission("batch", "delete")),
    db: AsyncSession = Depends(get_db),
):
    service = BatchService(db)

    await service.delete(
        id=batch_id,
        user_id=current_user.id,
    )

    return success_response(
        data={},
        message="Batch deleted successfully",
    )