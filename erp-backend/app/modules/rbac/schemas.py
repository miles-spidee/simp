from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID


class RoleCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_system: bool = False
    is_active: bool = True
    icon: Optional[str] = None


class RoleCreateWithModules(RoleCreate):
    module_ids: Optional[List[UUID]] = None


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    icon: Optional[str] = None


class RoleUpdateWithModules(RoleUpdate):
    module_ids: Optional[List[UUID]] = None


class RoleResponse(BaseModel):
    id: UUID
    name: str
    code: str
    description: Optional[str]
    is_system: bool
    is_active: bool
    icon: Optional[str]
    moduleIds: Optional[List[str]] = None


class PermissionAssign(BaseModel):
    role_id: UUID
    permission_ids: List[UUID]
