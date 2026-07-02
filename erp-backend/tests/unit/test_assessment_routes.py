import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_get_quizzes(client: AsyncClient):
    response = await client.get("/api/v1/assessment/quizzes")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["id"] == "batch-ai-2026"
    assert "assessments" in data[0]

@pytest.mark.anyio
async def test_create_assessment_fail(client: AsyncClient):
    # Invalid payload
    response = await client.post("/api/v1/assessment/quizzes", json={})
    assert response.status_code == 422
