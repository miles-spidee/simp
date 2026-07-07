from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings
from app.core.rls_session import RLSSession

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
    pool_recycle=1800,
    pool_timeout=10,
    echo=False,
    connect_args={
        "statement_cache_size": 0,
        "server_settings": {
            "application_name": "pinesphere_erp",
            "jit": "off",
        }
    }
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=RLSSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db(request: Request = None) -> AsyncGenerator[AsyncSession, None]:
    rls_context = getattr(request.state, "rls_context", None) if request else None
    print(f"DEBUG: get_db called with rls_context={rls_context is not None}")
    async with AsyncSessionLocal(rls_context=rls_context) as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


DBSession = Annotated[AsyncSession, Depends(get_db)]
