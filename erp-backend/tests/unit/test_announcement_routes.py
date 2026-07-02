from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.modules.announcement.router import router

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_announcement_routes():
    # GET list
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 2
    assert data["data"][0]["title"] == "Welcome to the New Pinesphere ERP Portal"
    
    # POST create fallback
    payload = {
        "title": "Custom Announcement",
        "description": "Custom body details",
        "category": "General",
        "priority": "Normal",
        "audience": ["All"],
        "pinned": False,
        "status": "Published"
    }
    response = client.post("/", json=payload)
    assert response.status_code == 200
    created = response.json()
    assert created["success"] is True
    assert created["data"]["title"] == "Custom Announcement"
