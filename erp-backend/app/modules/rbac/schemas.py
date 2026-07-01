from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

class RoleCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_system: bool = False

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    
class RoleResponse(BaseModel):
    id: UUID
    name: str
    code: str
    description: Optional[str]
    is_system: bool
    
class PermissionAssign(BaseModel):
    role_id: UUID
    permission_ids: List[UUID]
