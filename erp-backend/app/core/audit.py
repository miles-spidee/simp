"""
app/core/audit.py
=================
Audit log helper used by BaseService.log_audit_event().

Performance fix
---------------
The previous implementation called `await db.flush()` after adding every
audit log row.  Each flush is a synchronous round-trip to the database —
adding ~200 ms of latency (AWS RDS us-east-1 from India) to **every**
write operation in the system.

The fix: simply `db.add(log)` and let the row commit together with the
parent transaction via the existing `await self.commit_transaction()` call
in each service.  Zero data is lost — the row still reaches the DB — but we
eliminate a full network round-trip per request.
"""
from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.system.audit import ActivityLog


async def log_audit_event(
    db: AsyncSession,
    action: str,
    entity: str,
    user_id: UUID,
    entity_id: UUID = None,
    new_value: Any = None,
    old_value: Any = None,
    ip_address: str = None,
):
    """
    Stage an audit log entry in the current transaction.

    The row is committed by the caller's `commit_transaction()` — no extra
    flush is performed here, saving one DB round-trip per request.
    """
    log = ActivityLog(
        user_id=user_id,
        module_name=entity,
        action=action,
        description=f"Action: {action} on {entity} (ID: {entity_id})",
        ip_address=ip_address,
        device=None,
    )
    db.add(log)
    # ✅ No flush here — commit happens in the calling service.
    # Removing await db.flush() saves one full DB round-trip (~200ms on RDS).
