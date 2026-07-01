import pytest
from uuid import uuid4
from app.modules.identity.schemas import LoginRequest, RegisterRequest
from app.modules.users.schemas import UserCreate
from app.models.core.enums import StatusEnum

# Mocking the async session and repositories for isolated unit testing
class MockDB:
    async def commit(self): pass
    async def flush(self): pass
    def add(self, obj): pass

@pytest.mark.asyncio
async def test_identity_register():
    from app.modules.identity.service import IdentityService
    db = MockDB()
    service = IdentityService(db)
    
    # Mocking the repository methods
    async def mock_get_by_email(db, email): return None
    service.user_repo.get_by_email = mock_get_by_email
    
    request = RegisterRequest(name="Test User", email="test@pinesphere.com", password="securepassword", roleCode="STUDENT")
    result = await service.register(request)
    
    assert result["email"] == "test@pinesphere.com"
    assert "id" in result

@pytest.mark.asyncio
async def test_identity_login_fails_wrong_password():
    from app.modules.identity.service import IdentityService
    from fastapi import HTTPException
    
    db = MockDB()
    service = IdentityService(db)
    
    class MockUser:
        id = uuid4()
        email = "test@pinesphere.com"
        password_hash = "wronghash"
        account_status = StatusEnum.ACTIVE
        
    async def mock_get_by_email(db, email): return MockUser()
    service.user_repo.get_by_email = mock_get_by_email
    
    request = LoginRequest(username="test@pinesphere.com", password="wrongpassword")
    
    with pytest.raises(HTTPException) as exc:
        await service.login(request)
        
    assert exc.value.status_code == 401
