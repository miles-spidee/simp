import re
from logging.config import fileConfig

import sqlalchemy as sa
from sqlalchemy import create_engine

from alembic import context
from app.core.config import settings
from app.models.core.mixins import BaseModel as Base

# Import ALL models so Alembic can detect them
import app.models.authentication
import app.models.rbac
import app.models.organizations
import app.models.core
# Import others as they are fleshed out
import app.models.academic
import app.models.hr
import app.models.finance
import app.models.internships
import app.models.lms
import app.models.companies
import app.models.profiles
import app.models.communication
import app.models.system
import app.models.support
import app.models.analytics
import app.models.alumni_placements
import app.models.files

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# ---------------------------------------------------------------------------
# Build a *synchronous* psycopg2 URL from the asyncpg DATABASE_URL.
# asyncpg is used by the application at runtime, but for migrations we need
# psycopg2 so we can set TCP keepalive socket options — without keepalives,
# the AWS ELB / NAT idle timeout (~350 s) drops the connection mid-migration
# when running the large DDL batches like 73a08c5d1d64.
# ---------------------------------------------------------------------------
def _make_sync_url(async_url: str) -> str:
    """Convert postgresql+asyncpg://... to postgresql+psycopg2://..."""
    url = re.sub(r"postgresql\+asyncpg://", "postgresql+psycopg2://", async_url)
    # Strip asyncpg-specific query params; psycopg2 uses connect_args for SSL
    url = re.sub(r"\?ssl=require", "", url)
    return url


SYNC_DB_URL = _make_sync_url(settings.DATABASE_URL)

# psycopg2 connect_args:
#   sslmode=require   — keep SSL for AWS RDS
#   keepalives=1      — enable TCP keepalives
#   keepalives_idle=60    — send first keepalive probe after 60 s idle
#   keepalives_interval=10 — retry every 10 s
#   keepalives_count=5     — 5 missed probes → close
PSYCOPG2_CONNECT_ARGS = {
    "sslmode": "require",
    "keepalives": 1,
    "keepalives_idle": 60,
    "keepalives_interval": 10,
    "keepalives_count": 5,
    "options": "-c statement_timeout=0 -c idle_in_transaction_session_timeout=0",
}


def run_migrations_offline() -> None:
    context.configure(
        url=SYNC_DB_URL,
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: sa.engine.Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    engine = create_engine(
        SYNC_DB_URL,
        connect_args=PSYCOPG2_CONNECT_ARGS,
        # Avoid connection pool recycling mid-migration
        pool_pre_ping=True,
        pool_recycle=-1,
    )
    with engine.connect() as connection:
        do_run_migrations(connection)
    engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
