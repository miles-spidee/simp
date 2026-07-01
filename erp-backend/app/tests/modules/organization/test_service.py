import pytest
from uuid import uuid4
from app.modules.organization.schemas import CollegeCreate, DepartmentCreate, CoordinatorCreate
from app.modules.organization.service import OrganizationService

class MockDB:
    async def commit(self): pass
    async def flush(self): pass
    async def execute(self, query): pass
    def add(self, obj):
        obj.id = uuid4()

@pytest.mark.asyncio
async def test_onboard_college():
    db = MockDB()
    service = OrganizationService(db)
    
    request = CollegeCreate(
        college_name="Test Engineering College",
        college_code="TEC-01",
        college_email="info@tec.edu",
        accreditation="Accredited",
        status="Active"
    )
    
    org = await service.onboard_college(request, user_id=uuid4())
    assert org.name == "Test Engineering College"
    assert org.code == "TEC-01"
    assert org.partnership_status == "Active"
    assert org.id is not None

@pytest.mark.asyncio
async def test_add_department():
    db = MockDB()
    service = OrganizationService(db)
    
    request = DepartmentCreate(
        college_id=uuid4(),
        department_name="Computer Science",
        department_code="CSE",
        hod_name="Dr. Smith"
    )
    
    dept = await service.add_department(request, user_id=uuid4())
    assert dept.name == "Computer Science"
    assert dept.code == "CSE"
    assert dept.hod_name == "Dr. Smith"
    assert dept.id is not None

@pytest.mark.asyncio
async def test_assign_coordinator():
    db = MockDB()
    service = OrganizationService(db)
    
    request = CoordinatorCreate(
        college_id=uuid4(),
        coordinator_name="Jane Doe",
        coordinator_email="jane@tec.edu",
        department="Liaison"
    )
    
    coord = await service.assign_coordinator(request, user_id=uuid4())
    assert coord.name == "Jane Doe"
    assert coord.email == "jane@tec.edu"
    assert coord.department == "Liaison"
    assert coord.id is not None
