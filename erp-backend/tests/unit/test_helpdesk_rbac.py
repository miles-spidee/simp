import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.dependencies import get_current_user
from app.modules.helpdesk.router import get_user_roles
from app.models.authentication.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

# Define a mock user
mock_user = User(
    id=uuid.uuid4(),
    username="test_helpdesk_user",
    email="test_helpdesk@example.com",
    account_status="ACTIVE"
)

async def override_get_current_user():
    return mock_user

@pytest.mark.asyncio
async def test_student_ticket_assignment(client: AsyncClient, db: AsyncSession):
    # Fetch real student and mentor from DB
    student_user = (await db.execute(select(User).where(User.email == "student-1@pinesphere.example.com"))).scalars().first()
    mentor_user = (await db.execute(select(User).where(User.email == "mentor-1@pinesphere.example.com"))).scalars().first()
    
    assert student_user and mentor_user
    
    app.dependency_overrides[get_current_user] = lambda: student_user
    app.dependency_overrides[get_user_roles] = lambda: ["STUDENT"]
    
    payload = {
        "title": "Academic Issue with Attendance",
        "description": "My attendance for June is not synced.",
        "category": "Attendance",
        "priority": "Medium",
        "department": "Academics"
    }
    res = await client.post("/api/v1/helpdesk/", json=payload)
    assert res.status_code == 200
    ticket = res.json()["data"]
    assert ticket["status"] == "Assigned"
    assert ticket["assignedTo"] == str(mentor_user.id)
    
    # Student cannot resolve/escalate
    payload_resolve = {
        "resolveAction": "no",
        "remark": "Cannot resolve"
    }
    res_escalate = await client.patch(f"/api/v1/helpdesk/{ticket['id']}", json=payload_resolve)
    assert res_escalate.status_code == 403
    
    # Mentor can escalate
    app.dependency_overrides[get_current_user] = lambda: mentor_user
    app.dependency_overrides[get_user_roles] = lambda: ["MENTOR"]
    res_escalate_mentor = await client.patch(f"/api/v1/helpdesk/{ticket['id']}", json=payload_resolve)
    assert res_escalate_mentor.status_code == 200
    updated_ticket = res_escalate_mentor.json()["data"]
    assert updated_ticket["status"] == "Escalated"
    assert updated_ticket["assignedTo"] != str(mentor_user.id)
    
    # Clean up ticket to prevent DB pollution
    from app.models.support.helpdesk import Ticket
    await db.delete(await db.get(Ticket, uuid.UUID(ticket["id"])))
    await db.commit()
    app.dependency_overrides.clear()
