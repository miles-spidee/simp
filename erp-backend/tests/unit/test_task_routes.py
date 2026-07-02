from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.modules.task.router import router

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_get_task_list_route():
    # Calling the endpoint without DB should fall back to mock tasks cleanly
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 3
    assert data["data"][0]["title"] == "Portfolio Website"
