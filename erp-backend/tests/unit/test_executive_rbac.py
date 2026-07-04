import pytest
from httpx import AsyncClient
from app.main import app
from app.core.dependencies import get_current_user
from app.modules.executive.router import get_user_roles
from app.models.authentication.user import User
import uuid

# Define a mock user
mock_user = User(
    id=uuid.uuid4(),
    username="test_dashboard_user",
    email="test_dashboard@example.com",
    account_status="ACTIVE"
)

async def override_get_current_user():
    return mock_user

@pytest.mark.asyncio
async def test_super_admin_metrics(client: AsyncClient):
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_user_roles] = lambda: ["SUPER_ADMIN"]
    
    response = await client.get("/api/v1/executive/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    metrics = data["data"]
    titles = [m["title"] for m in metrics]
    assert "Total Revenue" in titles
    assert "Operating Cost" in titles
    assert "Profitability" in titles
    assert "Student Enrollment" in titles
    
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_hr_metrics(client: AsyncClient):
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_user_roles] = lambda: ["HR"]
    
    response = await client.get("/api/v1/executive/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    metrics = data["data"]
    titles = [m["title"] for m in metrics]
    assert "Employee Count" in titles
    assert "Recruitment" in titles
    assert "Leave Trends" in titles
    
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_reporting_manager_metrics(client: AsyncClient):
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_user_roles] = lambda: ["REPORTING_MANAGER"]
    
    response = await client.get("/api/v1/executive/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    metrics = data["data"]
    titles = [m["title"] for m in metrics]
    assert "Team Performance" in titles
    assert "Task Completion" in titles
    
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_finance_manager_metrics(client: AsyncClient):
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_user_roles] = lambda: ["FINANCE_MANAGER"]
    
    response = await client.get("/api/v1/executive/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    metrics = data["data"]
    titles = [m["title"] for m in metrics]
    assert "Revenue" in titles
    assert "Expenses" in titles
    assert "Cash Flow" in titles
    
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_mentor_metrics(client: AsyncClient):
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_user_roles] = lambda: ["MENTOR"]
    
    response = await client.get("/api/v1/executive/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    metrics = data["data"]
    titles = [m["title"] for m in metrics]
    assert "Assigned Students" in titles
    assert "LMS Completion" in titles
    
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_student_metrics_blocked(client: AsyncClient):
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_user_roles] = lambda: ["STUDENT"]
    
    response = await client.get("/api/v1/executive/metrics")
    assert response.status_code == 403
    
    app.dependency_overrides.clear()
