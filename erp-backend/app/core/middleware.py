from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.security import decode_access_token
from app.core.database import engine, AsyncSessionLocal

class RLSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        rls_context = None
        auth_header = request.headers.get("Authorization")
        
        user_id_str = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = decode_access_token(token)
                user_id_str = payload.get("sub")
            except Exception:
                pass
                
        # Handle development fallback if configured
        if not user_id_str:
            from app.core.config import settings
            if settings.APP_ENV == "development":
                # Get admin UUID for dev
                async with AsyncSessionLocal() as db:
                    from app.models.authentication.user import User
                    res = await db.execute(select(User.id).where(User.email == "admin@pinesphere.example.com"))
                    uid = res.scalar_one_or_none()
                    if uid:
                        user_id_str = str(uid)
        
        if user_id_str:
            try:
                user_id = uuid.UUID(user_id_str)
                rls_context = await self.build_rls_context(user_id)
            except Exception:
                pass
                
        request.state.rls_context = rls_context
        response = await call_next(request)
        return response

    async def build_rls_context(self, user_id: uuid.UUID) -> dict:
        from app.models.rbac.role import Role
        from app.models.rbac.user_role import UserRole
        from app.models.core.allocation import Allocation
        from app.models.profiles.employee_profile import EmployeeProfile
        
        context = {
            "user_id": user_id,
            "roles": [],
            "allocated_programs": [],
            "allocated_batches": [],
            "allocated_students": [],
            "organization_id": None
        }
        
        async with AsyncSessionLocal() as db:
            # 1. Get Roles
            stmt = select(Role.code).join(UserRole, UserRole.role_id == Role.id).where(UserRole.user_id == user_id)
            res = await db.execute(stmt)
            context["roles"] = res.scalars().all()
            
            # If SUPER_ADMIN or HR, no need to compute allocations
            if "SUPER_ADMIN" in context["roles"] or "HR" in context["roles"]:
                return context
                
            # 2. Get Organization ID
            org_stmt = select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user_id)
            org_res = await db.execute(org_stmt)
            context["organization_id"] = org_res.scalar_one_or_none()
            
            # 3. Get Allocations
            alloc_stmt = select(Allocation.target_type, Allocation.target_id).where(
                and_(Allocation.source_type == 'USER', Allocation.source_id == user_id, Allocation.status == 'ACTIVE')
            )
            alloc_res = await db.execute(alloc_stmt)
            allocations = alloc_res.all()
            
            for t_type, t_id in allocations:
                if t_type == 'PROGRAM':
                    context["allocated_programs"].append(t_id)
                elif t_type == 'BATCH':
                    context["allocated_batches"].append(t_id)
                    
            # 4. If Mentor, get student user_ids based on program allocation
            if "MENTOR" in context["roles"] and context["allocated_programs"]:
                stud_stmt = select(Allocation.source_id).where(
                    and_(
                        Allocation.source_type == 'STUDENT',
                        Allocation.target_type == 'PROGRAM',
                        Allocation.target_id.in_(context["allocated_programs"]),
                        Allocation.status == 'ACTIVE'
                    )
                )
                stud_res = await db.execute(stud_stmt)
                context["allocated_students"] = stud_res.scalars().all()
                
        return context
