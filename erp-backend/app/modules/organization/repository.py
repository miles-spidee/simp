from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.repositories.base import BaseRepository
from app.models.organizations.organization import Organization
from app.models.organizations.department import Department
from app.models.organizations.coordinator import OrganizationCoordinator
from app.modules.organization.schemas import CollegeCreate, CollegeUpdate, DepartmentCreate, DepartmentUpdate, CoordinatorCreate, CoordinatorUpdate

class OrganizationRepository(BaseRepository[Organization, CollegeCreate, CollegeUpdate]):
    def __init__(self):
        super().__init__(Organization, search_fields=["name", "code", "type"])
        
class DepartmentRepository(BaseRepository[Department, DepartmentCreate, DepartmentUpdate]):
    def __init__(self):
        super().__init__(Department, search_fields=["name", "code"])
        
class CoordinatorRepository(BaseRepository[OrganizationCoordinator, CoordinatorCreate, CoordinatorUpdate]):
    def __init__(self):
        super().__init__(OrganizationCoordinator, search_fields=["name", "email", "department"])
