import pytest
from fastapi import FastAPI
from httpx import AsyncClient, ASGITransport
from app.modules.escalation.router import router

app = FastAPI()
app.include_router(router)

@pytest.mark.asyncio
async def test_escalation_routes():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Rules
        response = await ac.get("/rules")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
        
        # Logs
        response = await ac.get("/logs")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
        
        # Update status
        response = await ac.patch("/esc-123", json={"status": "Resolved"})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "Resolved"
