"""Add Aadhaar verification fields

Revision ID: d41c7d8e9a2b
Revises: b85d1d564f15
Create Date: 2026-07-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'd41c7d8e9a2b'
down_revision: Union[str, None] = 'b85d1d564f15'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('sys_verification_records', sa.Column('aadhaar_verified', sa.Boolean(), nullable=False, server_default=sa.text('false')))
    op.add_column('sys_verification_records', sa.Column('verification_date', sa.DateTime(timezone=True), nullable=True))
    op.alter_column('sys_verification_records', 'aadhaar_verified', server_default=None)


def downgrade() -> None:
    op.drop_column('sys_verification_records', 'verification_date')
    op.drop_column('sys_verification_records', 'aadhaar_verified')