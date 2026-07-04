from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.responses import success_response, APIResponse
from app.modules.organization.schemas import (
    CollegeCreate, CollegeUpdate, CollegeResponse,
    DepartmentCreate, DepartmentUpdate, DepartmentResponse,
    CoordinatorCreate, CoordinatorUpdate, CoordinatorResponse
)
from app.modules.organization.service import OrganizationService
from app.models.authentication.user import User

router = APIRouter()

class BulkPartnershipRequest(BaseModel):
    ids: List[UUID]
    status: str
    
class BulkCoordinatorRequest(BaseModel):
    ids: List[UUID]
    coordinator_name: str

@router.get("/colleges", response_model=APIResponse[List[CollegeResponse]])
async def get_colleges(
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    result = await service.get_colleges()
    
    # Map to frontend schema
    data = []
    for org in result:
        data.append(CollegeResponse(
            college_id=org.id,
            college_name=org.name,
            college_code=org.code,
            college_email=org.email,
            college_phone=org.phone,
            website_url=org.website,
            address_line_1=org.address_line_1,
            address_line_2=org.address_line_2,
            city=org.city,
            state=org.state,
            country=org.country,
            postal_code=org.postal_code,
            accreditation=org.accreditation,
            status=org.partnership_status,
            created_at=org.created_at.isoformat() if org.created_at else "",
            updated_at=org.updated_at.isoformat() if org.updated_at else ""
        ))
    return success_response(data=data)

@router.post("/colleges", response_model=APIResponse[CollegeResponse])
async def create_college(
    data: CollegeCreate,
    current_user: User = Depends(require_permission("organizations", "create")),
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    org = await service.onboard_college(data, current_user.id)
    resp = CollegeResponse(
        college_id=org.id, college_name=org.name, college_code=org.code, college_email=org.email,
        college_phone=org.phone, website_url=org.website, address_line_1=org.address_line_1,
        address_line_2=org.address_line_2, city=org.city, state=org.state, country=org.country,
        postal_code=org.postal_code, accreditation=org.accreditation, status=org.partnership_status,
        created_at=org.created_at.isoformat() if org.created_at else "",
        updated_at=org.updated_at.isoformat() if org.updated_at else ""
    )
    return success_response(data=resp, message="College onboarded successfully")

@router.patch("/colleges/{id}", response_model=APIResponse[CollegeResponse])
async def update_college(
    id: UUID,
    data: CollegeUpdate,
    current_user: User = Depends(require_permission("organizations", "update")),
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    org = await service.update_college(id, data, current_user.id)
    resp = CollegeResponse(
        college_id=org.id, college_name=org.name, college_code=org.code, college_email=org.email,
        college_phone=org.phone, website_url=org.website, address_line_1=org.address_line_1,
        address_line_2=org.address_line_2, city=org.city, state=org.state, country=org.country,
        postal_code=org.postal_code, accreditation=org.accreditation, status=org.partnership_status,
        created_at=org.created_at.isoformat() if org.created_at else "",
        updated_at=org.updated_at.isoformat() if org.updated_at else ""
    )
    return success_response(data=resp, message="College updated successfully")


@router.get("/departments", response_model=APIResponse[List[DepartmentResponse]])
async def get_departments(
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    result = await service.get_departments()
    data = []
    for d in result:
        data.append(DepartmentResponse(
            department_id=d.id,
            college_id=d.organization_id,
            department_code=d.code,
            department_name=d.name,
            hod_name=d.hod_name,
            department_email="",
            status=d.status,
            created_at=d.created_at.isoformat() if d.created_at else "",
            updated_at=d.updated_at.isoformat() if d.updated_at else ""
        ))
    return success_response(data=data)

@router.post("/departments", response_model=APIResponse[DepartmentResponse])
async def create_department(
    data: DepartmentCreate,
    current_user: User = Depends(require_permission("organizations", "create")),
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    d = await service.add_department(data, current_user.id)
    resp = DepartmentResponse(
        department_id=d.id, college_id=d.organization_id, department_code=d.code,
        department_name=d.name, hod_name=d.hod_name, department_email="", status=d.status,
        created_at=d.created_at.isoformat() if d.created_at else "",
        updated_at=d.updated_at.isoformat() if d.updated_at else ""
    )
    return success_response(data=resp, message="Department added successfully")


@router.get("/college-coordinators", response_model=APIResponse[List[CoordinatorResponse]])
async def get_coordinators(
    current_user: User = Depends(require_permission("organizations", "read")),
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    result = await service.get_coordinators()
    data = []
    for c in result:
        data.append(CoordinatorResponse(
            coordinator_id=c.id, college_id=c.organization_id, coordinator_name=c.name,
            coordinator_email=c.email, coordinator_phone=c.phone, department=c.department,
            status=c.status, students_managed=c.students_managed, programs_managed=c.programs_managed,
            kpis={
                "applicationsProcessed": c.applications_processed,
                "attendanceApprovals": c.attendance_approvals,
                "internshipCompletions": c.internship_completions,
                "placementSuccess": c.placement_success_rate
            }
        ))
    return success_response(data=data)

@router.post("/college-coordinators", response_model=APIResponse[CoordinatorResponse])
async def create_coordinator(
    data: CoordinatorCreate,
    current_user: User = Depends(require_permission("organizations", "create")),
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    c = await service.assign_coordinator(data, current_user.id)
    resp = CoordinatorResponse(
        coordinator_id=c.id, college_id=c.organization_id, coordinator_name=c.name,
        coordinator_email=c.email, coordinator_phone=c.phone, department=c.department,
        status=c.status, students_managed=c.students_managed, programs_managed=c.programs_managed,
        kpis={
            "applicationsProcessed": c.applications_processed,
            "attendanceApprovals": c.attendance_approvals,
            "internshipCompletions": c.internship_completions,
            "placementSuccess": c.placement_success_rate
        }
    )
    return success_response(data=resp, message="Coordinator assigned successfully")

@router.post("/bulk-partnership", response_model=APIResponse[dict])
async def bulk_partnership(
    data: BulkPartnershipRequest,
    current_user: User = Depends(require_permission("organizations", "update")),
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    await service.bulk_update_partnership(data.ids, data.status, current_user.id)
    return success_response(data={}, message=f"Updated partnership status to {data.status}")

@router.post("/bulk-coordinators", response_model=APIResponse[dict])
async def bulk_coordinators(
    data: BulkCoordinatorRequest,
    current_user: User = Depends(require_permission("organizations", "update")),
    db: AsyncSession = Depends(get_db)
):
    service = OrganizationService(db)
    await service.bulk_assign_coordinator(data.ids, data.coordinator_name, current_user.id)
    return success_response(data={}, message=f"Assigned coordinator {data.coordinator_name}")
