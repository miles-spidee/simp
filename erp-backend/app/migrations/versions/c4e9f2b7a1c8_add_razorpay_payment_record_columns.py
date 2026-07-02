"""Add Razorpay payment record columns

Revision ID: c4e9f2b7a1c8
Revises: 73a08c5d1d64
Create Date: 2026-07-02 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'c4e9f2b7a1c8'
down_revision: Union[str, None] = '73a08c5d1d64'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('fin_payment_transactions', sa.Column('user_id', sa.UUID(), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('order_id', sa.UUID(), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('razorpay_order_id', sa.String(length=255), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('razorpay_payment_id', sa.String(length=255), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('razorpay_signature', sa.String(length=255), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('currency', sa.String(length=3), nullable=False, server_default=sa.text("'INR'")))
    op.add_column('fin_payment_transactions', sa.Column('payment_method', sa.String(length=50), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('receipt', sa.String(length=255), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('customer_email', sa.String(length=255), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('customer_contact', sa.String(length=50), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('customer_name', sa.String(length=255), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('notes', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('razorpay_created_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('fin_payment_transactions', sa.Column('refund', sa.Boolean(), nullable=False, server_default=sa.text('false')))

    op.alter_column('fin_payment_transactions', 'currency', server_default=None, existing_type=sa.String(length=3), existing_nullable=False)
    op.alter_column('fin_payment_transactions', 'refund', server_default=None, existing_type=sa.Boolean(), existing_nullable=False)

    op.create_foreign_key(
        op.f('fk_fin_payment_transactions_user_id_auth_users'),
        'fin_payment_transactions',
        'auth_users',
        ['user_id'],
        ['id'],
        ondelete='RESTRICT',
    )
    op.create_foreign_key(
        op.f('fk_fin_payment_transactions_order_id_intern_applications'),
        'fin_payment_transactions',
        'intern_applications',
        ['order_id'],
        ['id'],
        ondelete='RESTRICT',
    )

    op.create_unique_constraint(
        op.f('uq_fin_payment_transactions_order_id'),
        'fin_payment_transactions',
        ['order_id'],
    )
    op.create_unique_constraint(
        op.f('uq_fin_payment_transactions_razorpay_order_id'),
        'fin_payment_transactions',
        ['razorpay_order_id'],
    )
    op.create_unique_constraint(
        op.f('uq_fin_payment_transactions_razorpay_payment_id'),
        'fin_payment_transactions',
        ['razorpay_payment_id'],
    )

    op.create_index(op.f('ix_fin_payment_transactions_created_at'), 'fin_payment_transactions', ['created_at'], unique=False)
    op.create_index(op.f('ix_fin_payment_transactions_status'), 'fin_payment_transactions', ['status'], unique=False)
    op.create_index(op.f('ix_fin_payment_transactions_user_id'), 'fin_payment_transactions', ['user_id'], unique=False)
    op.create_index(op.f('ix_fin_payment_transactions_order_id'), 'fin_payment_transactions', ['order_id'], unique=False)
    op.create_index(op.f('ix_fin_payment_transactions_currency_id'), 'fin_payment_transactions', ['currency_id'], unique=False)
    op.create_index(op.f('ix_fin_payment_transactions_customer_email'), 'fin_payment_transactions', ['customer_email'], unique=False)
    op.create_index(op.f('ix_fin_payment_transactions_customer_contact'), 'fin_payment_transactions', ['customer_contact'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_fin_payment_transactions_customer_contact'), table_name='fin_payment_transactions')
    op.drop_index(op.f('ix_fin_payment_transactions_customer_email'), table_name='fin_payment_transactions')
    op.drop_index(op.f('ix_fin_payment_transactions_currency_id'), table_name='fin_payment_transactions')
    op.drop_index(op.f('ix_fin_payment_transactions_order_id'), table_name='fin_payment_transactions')
    op.drop_index(op.f('ix_fin_payment_transactions_user_id'), table_name='fin_payment_transactions')
    op.drop_index(op.f('ix_fin_payment_transactions_status'), table_name='fin_payment_transactions')
    op.drop_index(op.f('ix_fin_payment_transactions_created_at'), table_name='fin_payment_transactions')

    op.drop_constraint(op.f('uq_fin_payment_transactions_razorpay_payment_id'), 'fin_payment_transactions', type_='unique')
    op.drop_constraint(op.f('uq_fin_payment_transactions_razorpay_order_id'), 'fin_payment_transactions', type_='unique')
    op.drop_constraint(op.f('uq_fin_payment_transactions_order_id'), 'fin_payment_transactions', type_='unique')

    op.drop_constraint(op.f('fk_fin_payment_transactions_order_id_intern_applications'), 'fin_payment_transactions', type_='foreignkey')
    op.drop_constraint(op.f('fk_fin_payment_transactions_user_id_auth_users'), 'fin_payment_transactions', type_='foreignkey')

    op.drop_column('fin_payment_transactions', 'refund')
    op.drop_column('fin_payment_transactions', 'razorpay_created_at')
    op.drop_column('fin_payment_transactions', 'notes')
    op.drop_column('fin_payment_transactions', 'customer_name')
    op.drop_column('fin_payment_transactions', 'customer_contact')
    op.drop_column('fin_payment_transactions', 'customer_email')
    op.drop_column('fin_payment_transactions', 'receipt')
    op.drop_column('fin_payment_transactions', 'payment_method')
    op.drop_column('fin_payment_transactions', 'currency')
    op.drop_column('fin_payment_transactions', 'razorpay_signature')
    op.drop_column('fin_payment_transactions', 'razorpay_payment_id')
    op.drop_column('fin_payment_transactions', 'razorpay_order_id')
    op.drop_column('fin_payment_transactions', 'order_id')
    op.drop_column('fin_payment_transactions', 'user_id')
