"""
core/database.py

Shared SQLAlchemy 2.0 declarative base and async engine/session factory.

All ORM models must inherit from `Base` defined here so that they share a
single `MetaData` object — required for `Base.metadata.create_all()` and
Alembic autogenerate to see every table.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models across every module."""
    pass
