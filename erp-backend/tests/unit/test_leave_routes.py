from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.modules.leave.router import router

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_leave_routes():
    # GET list
    response = client.get("/")
    assert response.status_code == 200
    leaves = response.json()
    assert isinstance(leaves, list)
    assert len(leaves) >= 2
    assert leaves[0]["leaveType"] == "Medical"
    
    # POST create
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
    response = client.post("/", json=payload)
    assert response.status_code == 200
    created = response.json()
    assert "id" in created
    assert created["leaveType"] == "Casual"
    
    # Verify it got added to the list
    response = client.get("/")
    assert response.status_code == 200
    leaves = response.json()
    assert len(leaves) == 3
    assert leaves[0]["leaveType"] == "Casual"
