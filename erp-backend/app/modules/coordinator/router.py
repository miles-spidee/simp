from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.responses import success_response
from app.models.organizations.coordinator import OrganizationCoordinator
from app.models.system.report import ReportRecord
import uuid
from typing import Optional

router = APIRouter()

@router.get("")
async def get_coordinators(db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(OrganizationCoordinator)
        res = await db.execute(stmt)
        coords = res.scalars().all()
        
        data = []
        for c in coords:
            data.append({
                "id": str(c.id),
                "employeeId": f"EMP-{str(c.id)[:4]}", # Since no direct employee ID in this schema
                "collegeId": str(c.organization_id),
                "name": c.name,
                "email": c.email,
                "phone": c.phone or "",
                "assignedStudentsCount": c.students_managed,
                "activeBatchesCount": c.programs_managed,
                "placementsCount": int(c.placement_success_rate * c.students_managed) if c.students_managed else 0,
                "status": c.status
            })
        return success_response(data=data)
    except Exception as e:
        return success_response(data=[])

@router.post("")
async def create_coordinator(data: dict, db: AsyncSession = Depends(get_db)):
    try:
        org_id_str = data.get("collegeId")
        # Ensure we have a valid UUID for org_id, if not, find one or create it.
        if org_id_str:
            try:
                org_id = uuid.UUID(org_id_str)
            except:
                from app.models.organizations.organization import Organization
                org = await db.scalar(select(Organization).limit(1))
                org_id = org.id if org else None
        else:
            from app.models.organizations.organization import Organization
            org = await db.scalar(select(Organization).limit(1))
            org_id = org.id if org else None
            
        if not org_id:
            raise HTTPException(status_code=400, detail="No organization available to link coordinator")

        coord = OrganizationCoordinator(
            organization_id=org_id,
            name=data.get("name", "Unknown"),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            status=data.get("status", "Active"),
            students_managed=int(data.get("assignedStudentsCount", 0)),
            programs_managed=int(data.get("activeBatchesCount", 0))
        )
        db.add(coord)
        await db.commit()
        await db.refresh(coord)
        
        data["id"] = str(coord.id)
        return success_response(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id}/reports")
async def get_reports(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    try:
        # Assuming reports created by this coordinator are linked via created_by=id or we fetch ReportRecord
        # But report.created_by is usually user_id. Here coordinator id is not a user_id directly.
        # Fallback to an empty array for now since we don't have mock data anymore.
        # Or fetch reports for the org.
        coord = await db.scalar(select(OrganizationCoordinator).where(OrganizationCoordinator.id == id))
        if coord:
            # You could link to reports specifically by some convention
            pass
        return success_response(data=[])
    except Exception as e:
        return success_response(data=[])

@router.post("/{id}/reports")
async def create_report(id: uuid.UUID, data: dict, db: AsyncSession = Depends(get_db)):
    return success_response(data=data)

@router.delete("/{id}")
async def delete_coordinator(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    try:
        coord = await db.scalar(select(OrganizationCoordinator).where(OrganizationCoordinator.id == id))
        if coord:
            await db.delete(coord)
            await db.commit()
        return success_response(message="Deleted successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
