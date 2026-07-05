import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from app.modules.activity.router import router

app = FastAPI()
app.include_router(router)

@pytest.mark.asyncio
async def test_activity_routes():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Test GET list
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)

        # Test GET export
        response_export = await client.get("/export")
        assert response_export.status_code == 200
        assert response_export.headers["content-type"] == "text/csv; charset=utf-8"
        assert "attachment; filename=\"activity_logs.csv\"" in response_export.headers["content-disposition"]
        
        import csv
        import io
        content = response_export.text
        reader = csv.reader(io.StringIO(content))
        rows = list(reader)
        assert len(rows) > 0
        assert rows[0] == [
            "ID", "User ID", "Username", "Role", "Module", 
            "Action", "Description", "Timestamp", "Device", 
            "Browser", "IP Address", "Status", "Severity"
        ]
