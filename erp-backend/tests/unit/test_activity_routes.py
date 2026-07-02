from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.modules.activity.router import router

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_activity_routes():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
