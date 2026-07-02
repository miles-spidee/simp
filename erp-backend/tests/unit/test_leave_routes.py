import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_leave_routes(client: AsyncClient):
    # 1. GET list (might be empty or have seeded leaves)
    response = await client.get("/api/v1/leave/")
    assert response.status_code == 200
    leaves = response.json()
    assert isinstance(leaves, list)
    initial_count = len(leaves)
    
    # 2. POST create
    payload = {
        "userId": "user-1",
        "userName": "Ananya Desai",
        "role": "Student",
        "leaveType": "Casual",
        "startDate": "2026-07-20T00:00:00.000Z",
        "endDate": "2026-07-22T00:00:00.000Z",
        "reason": "Personal work",
        "status": "Pending",
        "appliedOn": "2026-07-02T15:00:00.000Z"
    }
    response = await client.post("/api/v1/leave/", json=payload)
    assert response.status_code == 200
    created = response.json()
    assert "id" in created
    assert created["leaveType"] == "Casual"
    
    # 3. Verify it got added to the list
    response = await client.get("/api/v1/leave/")
    assert response.status_code == 200
    leaves = response.json()
    assert len(leaves) == initial_count + 1
    assert any(x["leaveType"] == "Casual" for x in leaves)
