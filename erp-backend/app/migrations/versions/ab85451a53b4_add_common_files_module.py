"""add common files module

Revision ID: ab85451a53b4
Revises: c4e9f2b7a1c8
Create Date: 2026-07-02 21:43:00.614548

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ab85451a53b4'
down_revision: Union[str, None] = 'c4e9f2b7a1c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Let op.create_table automatically create the enum types in the database
    op.create_table('file_records',
        sa.Column('file_name', sa.String(length=255), nullable=False),
        sa.Column('display_name', sa.String(length=255), nullable=False),
        sa.Column('unique_file_name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('file_type', sa.String(length=100), nullable=False),
        sa.Column('file_extension', sa.String(length=20), nullable=False),
        sa.Column('file_size', sa.BigInteger(), nullable=False),
        sa.Column('checksum', sa.String(length=255), nullable=False),
        sa.Column('storage_provider', sa.String(length=50), nullable=False),
        sa.Column('storage_path', sa.Text(), nullable=False),
        sa.Column('public_url', sa.Text(), nullable=True),
        sa.Column('thumbnail_url', sa.Text(), nullable=True),
        sa.Column('preview_url', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('module_name', sa.String(length=100), nullable=False),
        sa.Column('entity_name', sa.String(length=100), nullable=False),
        sa.Column('entity_id', sa.UUID(), nullable=False),
        sa.Column('folder_name', sa.String(length=255), nullable=True),
        sa.Column('tags', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('is_latest', sa.Boolean(), nullable=False),
        sa.Column('status', sa.Enum('DRAFT', 'ACTIVE', 'ARCHIVED', 'DELETED', name='file_status_enum'), nullable=False),
        sa.Column('uploaded_by', sa.UUID(), nullable=False),
        sa.Column('approved_by', sa.UUID(), nullable=True),
        sa.Column('approved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('download_count', sa.Integer(), nullable=False),
        sa.Column('last_downloaded_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=False),
        sa.Column('is_downloadable', sa.Boolean(), nullable=False),
        sa.Column('is_editable', sa.Boolean(), nullable=False),
        sa.Column('is_confidential', sa.Boolean(), nullable=False),
        sa.Column('access_level', sa.Enum('PUBLIC', 'INTERNAL', 'RESTRICTED', name='access_level_enum'), nullable=False),
        sa.Column('remarks', sa.Text(), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('id', sa.UUID(), nullable=False, comment='Unique identifier for the record'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, comment='Timestamp when the record was created'),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, comment='Timestamp when the record was last updated'),
        sa.Column('created_by', sa.UUID(), nullable=True, comment='UUID of the user who created this record (Soft FK)'),
        sa.Column('updated_by', sa.UUID(), nullable=True, comment='UUID of the user who last updated this record (Soft FK)'),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True, comment='Timestamp when the record was soft-deleted. NULL means active.'),
        sa.Column('version_id', sa.Integer(), nullable=False, comment='Optimistic locking version number'),
        sa.CheckConstraint('download_count >= 0', name=op.f('ck_file_records_chk_file_records_download_count_min')),
        sa.CheckConstraint('version >= 1', name=op.f('ck_file_records_chk_file_records_version_min')),
        sa.ForeignKeyConstraint(['approved_by'], ['auth_users.id'], name=op.f('fk_file_records_approved_by_auth_users'), ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['uploaded_by'], ['auth_users.id'], name=op.f('fk_file_records_uploaded_by_auth_users'), ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_file_records')),
        comment='Central registry for all uploaded files and documents'
    )
    op.create_index(op.f('ix_file_records_access_level'), 'file_records', ['access_level'], unique=False)
    op.create_index(op.f('ix_file_records_approved_by'), 'file_records', ['approved_by'], unique=False)
    op.create_index(op.f('ix_file_records_category'), 'file_records', ['category'], unique=False)
    op.create_index(op.f('ix_file_records_checksum'), 'file_records', ['checksum'], unique=True)
    op.create_index(op.f('ix_file_records_created_by'), 'file_records', ['created_by'], unique=False)
    op.create_index(op.f('ix_file_records_deleted_at'), 'file_records', ['deleted_at'], unique=False)
    op.create_index(op.f('ix_file_records_entity_id'), 'file_records', ['entity_id'], unique=False)
    op.create_index(op.f('ix_file_records_entity_name'), 'file_records', ['entity_name'], unique=False)
    op.create_index(op.f('ix_file_records_is_latest'), 'file_records', ['is_latest'], unique=False)
    op.create_index('ix_file_records_metadata', 'file_records', ['metadata'], unique=False, postgresql_using='gin')
    op.create_index(op.f('ix_file_records_module_name'), 'file_records', ['module_name'], unique=False)
    op.create_index(op.f('ix_file_records_status'), 'file_records', ['status'], unique=False)
    op.create_index(op.f('ix_file_records_storage_provider'), 'file_records', ['storage_provider'], unique=False)
    op.create_index('ix_file_records_tags', 'file_records', ['tags'], unique=False, postgresql_using='gin')
    op.create_index(op.f('ix_file_records_unique_file_name'), 'file_records', ['unique_file_name'], unique=True)
    op.create_index(op.f('ix_file_records_updated_by'), 'file_records', ['updated_by'], unique=False)
    op.create_index(op.f('ix_file_records_uploaded_by'), 'file_records', ['uploaded_by'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_file_records_uploaded_by'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_updated_by'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_unique_file_name'), table_name='file_records')
    op.drop_index('ix_file_records_tags', table_name='file_records', postgresql_using='gin')
    op.drop_index(op.f('ix_file_records_storage_provider'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_status'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_module_name'), table_name='file_records')
    op.drop_index('ix_file_records_metadata', table_name='file_records', postgresql_using='gin')
    op.drop_index(op.f('ix_file_records_is_latest'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_entity_name'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_entity_id'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_deleted_at'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_created_by'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_checksum'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_category'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_approved_by'), table_name='file_records')
    op.drop_index(op.f('ix_file_records_access_level'), table_name='file_records')
    op.drop_table('file_records')

    # Drop enum types explicitly
    file_status_enum = postgresql.ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', 'DELETED', name='file_status_enum')
    file_status_enum.drop(op.get_bind(), checkfirst=True)
    access_level_enum = postgresql.ENUM('PUBLIC', 'INTERNAL', 'RESTRICTED', name='access_level_enum')
    access_level_enum.drop(op.get_bind(), checkfirst=True)
