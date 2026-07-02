from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.modules.escalation.router import router

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_escalation_routes():
    # Rules
    response = client.get("/rules")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    
    # Logs
    response = client.get("/logs")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    
    # Update status
    response = client.patch("/esc-123", json={"status": "Resolved"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "Resolved"
