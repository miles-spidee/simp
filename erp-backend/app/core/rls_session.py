from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Select

class RLSSession(AsyncSession):
    def __init__(self, rls_context=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.rls_context = rls_context

    async def execute(self, statement, parameters=None, **kw):
        # We only apply RLS to Select statements
        if self.rls_context and isinstance(statement, Select):
            statement = self._apply_rls(statement)
        
        return await super().execute(statement, parameters, **kw)
        
    def _apply_rls(self, stmt: Select) -> Select:
        # Extract tables from statement
        # Check if tables correspond to StudentProfile, Batch, Program, etc.
        # Apply filters using self.rls_context (which contains roles and allocations)
        
        # Example context:
        # rls_context = {
        #    "roles": ["MENTOR"],
        #    "allocated_programs": [UUID, ...],
        #    "allocated_batches": [],
        #    "organization_id": None
        # }
        
        if "SUPER_ADMIN" in self.rls_context["roles"] or "HR" in self.rls_context["roles"]:
            return stmt

        # To map tables, we can check their names
        table_names = [from_obj.name for from_obj in stmt.get_final_froms() if hasattr(from_obj, 'name')]
        
        # For each secured table, apply the where clause
        for from_obj in stmt.get_final_froms():
            if not hasattr(from_obj, 'name'):
                continue
                
            table_name = from_obj.name
            
            # Student Profile RLS
            if table_name == 'profiles_students':
                if "COLLEGE_COORDINATOR" in self.rls_context["roles"]:
                    org_id = self.rls_context.get("organization_id")
                    if org_id:
                        stmt = stmt.where(from_obj.c.organization_id == org_id)
                    else:
                        stmt = stmt.where(from_obj.c.id == None)
                        
                elif "FINANCE_MANAGER" in self.rls_context["roles"] or "REPORTING_MANAGER" in self.rls_context["roles"]:
                    alloc_batches = self.rls_context.get("allocated_batches", [])
                    if alloc_batches:
                        stmt = stmt.where(from_obj.c.batch_id.in_(alloc_batches))
                    else:
                        stmt = stmt.where(from_obj.c.id == None)
                        
                elif "MENTOR" in self.rls_context["roles"]:
                    alloc_students = self.rls_context.get("allocated_students", [])
                    if alloc_students:
                        stmt = stmt.where(from_obj.c.user_id.in_(alloc_students))
                    else:
                        stmt = stmt.where(from_obj.c.id == None)

            # Program RLS
            if table_name == 'core_programs':
                if "MENTOR" in self.rls_context["roles"]:
                    alloc_progs = self.rls_context.get("allocated_programs", [])
                    if alloc_progs:
                        stmt = stmt.where(from_obj.c.id.in_(alloc_progs))
                    else:
                        stmt = stmt.where(from_obj.c.id == None)

            # Batch RLS
            if table_name == 'core_batches':
                if "FINANCE_MANAGER" in self.rls_context["roles"] or "REPORTING_MANAGER" in self.rls_context["roles"]:
                    alloc_batches = self.rls_context.get("allocated_batches", [])
                    if alloc_batches:
                        stmt = stmt.where(from_obj.c.id.in_(alloc_batches))
                    else:
                        stmt = stmt.where(from_obj.c.id == None)

        return stmt
