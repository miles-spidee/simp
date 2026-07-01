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
    ip_address: str = None
):
    """
    Creates an audit log entry.
    Requires the db session to be passed from the transaction.
    """
    log = ActivityLog(
        user_id=user_id,
        module_name=entity,
        action=action,
        description=f"Action: {action} on {entity} (ID: {entity_id})",
        ip_address=ip_address,
        device=None
    )
    db.add(log)
    # Flushes the log into the current transaction
    await db.flush()
