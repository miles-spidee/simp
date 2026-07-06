import re

with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/modules/mentor/router.py', 'r') as f:
    content = f.read()

# Add batch mappings schemas
schemas = """from pydantic import BaseModel
class MentorBatchMappingCreate(BaseModel):
    mentor_id: UUID
    batch_id: UUID

class MentorBatchMappingResponse(BaseModel):
    mapping_id: str
    mentor_id: UUID
    batch_id: UUID
    assigned_at: str

@router.get("/batch-mappings", response_model=APIResponse[list[MentorBatchMappingResponse]])
"""

content = content.replace('@router.get("/batch-mappings", response_model=APIResponse[list])\n', schemas)

new_get_batch_mappings = """async def get_batch_mappings(
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db),
):
    from app.models.core.allocation import Allocation
    from sqlalchemy import select
    stmt = select(Allocation).where(Allocation.source_type == "MENTOR", Allocation.target_type == "BATCH", Allocation.deleted_at.is_(None))
    result = await db.execute(stmt)
    allocations = result.scalars().all()
    
    data = []
    for alloc in allocations:
        data.append(MentorBatchMappingResponse(
            mapping_id=str(alloc.id),
            mentor_id=alloc.source_id,
            batch_id=alloc.target_id,
            assigned_at=alloc.start_date.isoformat() if alloc.start_date else ""
        ))
    return success_response(data=data)

@router.post("/batch-mappings", response_model=APIResponse[MentorBatchMappingResponse])
async def create_batch_mapping(
    payload: MentorBatchMappingCreate,
    current_user: User = Depends(require_permission("mentor", "create")),
    db: AsyncSession = Depends(get_db),
):
    from app.models.core.allocation import Allocation
    from sqlalchemy import select
    
    stmt = select(Allocation).where(
        Allocation.source_type == "MENTOR", 
        Allocation.target_type == "BATCH", 
        Allocation.target_id == payload.batch_id,
        Allocation.deleted_at.is_(None)
    )
    result = await db.execute(stmt)
    existing = result.scalars().first()
    
    if existing:
        if existing.source_id == payload.mentor_id:
            return success_response(data=MentorBatchMappingResponse(
                mapping_id=str(existing.id), mentor_id=existing.source_id, batch_id=existing.target_id, assigned_at=existing.start_date.isoformat()
            ))
        # Update existing
        existing.source_id = payload.mentor_id
        await db.commit()
        return success_response(data=MentorBatchMappingResponse(
            mapping_id=str(existing.id), mentor_id=existing.source_id, batch_id=existing.target_id, assigned_at=existing.start_date.isoformat()
        ))
    
    alloc = Allocation(
        source_type="MENTOR",
        source_id=payload.mentor_id,
        target_type="BATCH",
        target_id=payload.batch_id,
        role="LEAD_MENTOR",
        created_by=current_user.id,
        updated_by=current_user.id
    )
    db.add(alloc)
    await db.commit()
    await db.refresh(alloc)
    
    return success_response(data=MentorBatchMappingResponse(
        mapping_id=str(alloc.id), mentor_id=alloc.source_id, batch_id=alloc.target_id, assigned_at=alloc.start_date.isoformat()
    ))
"""

content = re.sub(r'async def get_batch_mappings\(.*?return success_response\(data=\[\]\)', new_get_batch_mappings, content, flags=re.DOTALL)


with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/modules/mentor/router.py', 'w') as f:
    f.write(content)

print("Done")
