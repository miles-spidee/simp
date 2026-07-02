from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.modules.notification.router import router

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_notification_routes():
    # GET list
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 2
    assert data["data"][0]["title"] == "Welcome to Pinesphere ERP"
    
    # POST create
    payload = {
        "title": "New Notification Alert",
        "message": "Detail message body",
        "recipient": "test@gmail.com",
        "role": "Student",
        "module": "Leave",
        "channel": "In-App Notification",
        "priority": "Medium",
        "status": "Delivered"
    }
    response = client.post("/", json=payload)
    assert response.status_code == 200
    created = response.json()
    assert created["success"] is True
    assert created["data"]["title"] == "New Notification Alert"
    
    # PATCH read status
    response = client.patch(f"/{created['data']['id']}", json={"readStatus": True, "status": "Read"})
    assert response.status_code == 200
    updated = response.json()
    assert updated["success"] is True
    assert updated["data"]["readStatus"] is True
