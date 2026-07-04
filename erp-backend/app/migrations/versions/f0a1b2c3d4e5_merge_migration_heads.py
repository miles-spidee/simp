"""Merge migration heads

Revision ID: f0a1b2c3d4e5
Revises: ab85451a53b4, e5f6g7h8i9j0
Create Date: 2026-07-04 00:00:00.000000

"""
from typing import Sequence, Union


revision: str = "f0a1b2c3d4e5"
down_revision: Union[str, tuple[str, str], None] = (
    "ab85451a53b4",
    "e5f6g7h8i9j0",
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
