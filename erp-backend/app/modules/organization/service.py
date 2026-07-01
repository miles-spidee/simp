from uuid import UUID
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.services.base import BaseService
from app.modules.organization.repository import OrganizationRepository, DepartmentRepository, CoordinatorRepository
from app.modules.organization.schemas import CollegeCreate, CollegeUpdate, DepartmentCreate, CoordinatorCreate
from app.models.organizations.organization import Organization
from app.models.organizations.department import Department
from app.models.organizations.coordinator import OrganizationCoordinator
from datetime import datetime

class OrganizationService(BaseService):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.org_repo = OrganizationRepository()
        self.dept_repo = DepartmentRepository()
        self.coord_repo = CoordinatorRepository()

    async def get_colleges(self) -> List[Organization]:
        # Using pagination with high limit for frontend table
        res = await self.org_repo.get_paginated(self.db, page=1, page_size=1000)
        return res[0]

    async def onboard_college(self, data: CollegeCreate, user_id: UUID = None) -> Organization:
        org = Organization(
            name=data.college_name,
            code=data.college_code,
            email=data.college_email,
            phone=data.college_phone,
            website=data.website_url,
            address_line_1=data.address_line_1,
            address_line_2=data.address_line_2,
            city=data.city,
            state=data.state,
            country=data.country,
            postal_code=data.postal_code,
            accreditation=data.accreditation,
            partnership_status=data.status or "Active"
        )
        self.db.add(org)
        await self.db.flush()
        
        await self.log_audit_event("ONBOARD_COLLEGE", "Organization", user_id, new_value={"id": str(org.id), "name": org.name})
        await self.commit_transaction()
        return org

    async def update_college(self, id: UUID, data: CollegeUpdate, user_id: UUID = None) -> Organization:
        org = await self.org_repo.get(self.db, id)
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")
            
        update_data = data.model_dump(exclude_unset=True)
        # Handle field mapping
        if 'college_name' in update_data: org.name = update_data.pop('college_name')
        if 'college_code' in update_data: org.code = update_data.pop('college_code')
        if 'college_email' in update_data: org.email = update_data.pop('college_email')
        if 'college_phone' in update_data: org.phone = update_data.pop('college_phone')
        if 'website_url' in update_data: org.website = update_data.pop('website_url')
        if 'status' in update_data: org.partnership_status = update_data.pop('status')
        
        for k, v in update_data.items():
            setattr(org, k, v)
            
        self.db.add(org)
        await self.log_audit_event("UPDATE_COLLEGE", "Organization", user_id, new_value=update_data)
        await self.commit_transaction()
        return org

    async def add_department(self, data: DepartmentCreate, user_id: UUID = None) -> Department:
        dept = Department(
            organization_id=data.college_id,
            name=data.department_name,
            code=data.department_code,
            hod_name=data.hod_name
        )
        self.db.add(dept)
        await self.db.flush()
        
        await self.log_audit_event("ADD_DEPARTMENT", "Department", user_id, new_value={"id": str(dept.id), "name": dept.name})
        await self.commit_transaction()
        return dept

    async def get_departments(self) -> List[Department]:
        res = await self.dept_repo.get_paginated(self.db, page=1, page_size=5000)
        return res[0]

    async def assign_coordinator(self, data: CoordinatorCreate, user_id: UUID = None) -> OrganizationCoordinator:
        coord = OrganizationCoordinator(
            organization_id=data.college_id,
            name=data.coordinator_name,
            email=data.coordinator_email,
            phone=data.coordinator_phone,
            department=data.department
        )
        self.db.add(coord)
        await self.db.flush()
        
        await self.log_audit_event("ASSIGN_COORDINATOR", "OrganizationCoordinator", user_id, new_value={"id": str(coord.id)})
        await self.commit_transaction()
        return coord

    async def get_coordinators(self) -> List[OrganizationCoordinator]:
        res = await self.coord_repo.get_paginated(self.db, page=1, page_size=2000)
        return res[0]

    async def bulk_update_partnership(self, ids: List[UUID], status: str, user_id: UUID = None) -> bool:
        from sqlalchemy import update
        await self.db.execute(
            update(Organization)
            .where(Organization.id.in_(ids))
            .values(partnership_status=status)
        )
        await self.log_audit_event("BULK_PARTNERSHIP_UPDATE", "Organization", user_id, new_value={"ids": [str(i) for i in ids], "status": status})
        await self.commit_transaction()
        return True

    async def bulk_assign_coordinator(self, ids: List[UUID], coordinator_name: str, user_id: UUID = None) -> bool:
        # Pseudo business logic: creates a coordinator entry for each selected org
        for org_id in ids:
            coord = OrganizationCoordinator(
                organization_id=org_id,
                name=coordinator_name,
                email=f"{coordinator_name.lower().replace(' ', '_')}@institution.edu",
                department="General Liaison"
            )
            self.db.add(coord)
            
        await self.log_audit_event("BULK_ASSIGN_COORDINATOR", "OrganizationCoordinator", user_id, new_value={"org_ids": [str(i) for i in ids]})
        await self.commit_transaction()
        return True
