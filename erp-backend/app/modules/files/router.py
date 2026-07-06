from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User

from app.modules.files.schemas import (
    FileCreate,
    FileUpdate,
    FileResponse,
)

from app.modules.files.service import FileService

router = APIRouter()


@router.get("", response_model=APIResponse[list[FileResponse]])
async def get_files(
    current_user: User = Depends(require_permission("files", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    files = await service.get_multi(current_user=current_user, limit=1000)

    return success_response(
        data=[
            FileResponse(
                file_id=f.id,
                file_name=f.file_name,
                display_name=f.display_name,
                unique_file_name=f.unique_file_name,
                description=f.description,
                file_type=f.file_type,
                file_extension=f.file_extension,
                file_size=f.file_size,
                checksum=f.checksum,
                storage_provider=f.storage_provider,
                storage_path=f.storage_path,
                public_url=f.public_url,
                thumbnail_url=f.thumbnail_url,
                preview_url=f.preview_url,
                category=f.category,
                module_name=f.module_name,
                entity_name=f.entity_name,
                entity_id=f.entity_id,
                folder_name=f.folder_name,
                tags=f.tags,
                version=f.version,
                is_latest=f.is_latest,
                status=f.status,
                uploaded_by=f.uploaded_by,
                approved_by=f.approved_by,
                approved_at=f.approved_at,
                expires_at=f.expires_at,
                download_count=f.download_count,
                last_downloaded_at=f.last_downloaded_at,
                is_public=f.is_public,
                is_downloadable=f.is_downloadable,
                is_editable=f.is_editable,
                is_confidential=f.is_confidential,
                access_level=f.access_level,
                remarks=f.remarks,
                file_metadata=f.file_metadata,
                created_at=f.created_at.isoformat() if f.created_at else "",
                updated_at=f.updated_at.isoformat() if f.updated_at else "",
            )
            for f in files
        ]
    )


@router.post("", response_model=APIResponse[FileResponse])
async def create_file(
    data: FileCreate,
    current_user: User = Depends(require_permission("files", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    file = await service.create(
        obj_in=data,
        user_id=current_user.id,
    )

    return success_response(
        data=FileResponse(
            file_id=file.id,
            file_name=file.file_name,
            display_name=file.display_name,
            unique_file_name=file.unique_file_name,
            description=file.description,
            file_type=file.file_type,
            file_extension=file.file_extension,
            file_size=file.file_size,
            checksum=file.checksum,
            storage_provider=file.storage_provider,
            storage_path=file.storage_path,
            public_url=file.public_url,
            thumbnail_url=file.thumbnail_url,
            preview_url=file.preview_url,
            category=file.category,
            module_name=file.module_name,
            entity_name=file.entity_name,
            entity_id=file.entity_id,
            folder_name=file.folder_name,
            tags=file.tags,
            version=file.version,
            is_latest=file.is_latest,
            status=file.status,
            uploaded_by=file.uploaded_by,
            approved_by=file.approved_by,
            approved_at=file.approved_at,
            expires_at=file.expires_at,
            download_count=file.download_count,
            last_downloaded_at=file.last_downloaded_at,
            is_public=file.is_public,
            is_downloadable=file.is_downloadable,
            is_editable=file.is_editable,
            is_confidential=file.is_confidential,
            access_level=file.access_level,
            remarks=file.remarks,
            file_metadata=file.file_metadata,
            created_at=file.created_at.isoformat() if file.created_at else "",
            updated_at=file.updated_at.isoformat() if file.updated_at else "",
        ),
        message="File created successfully",
    )


@router.patch("/{file_id}", response_model=APIResponse[FileResponse])
async def update_file(
    file_id: UUID,
    data: FileUpdate,
    current_user: User = Depends(require_permission("files", "update")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    file = await service.update(
        id=file_id,
        obj_in=data,
        user_id=current_user.id,
    )

    return success_response(
        data=FileResponse.model_validate(file),
        message="File updated successfully",
    )


@router.delete("/{file_id}", response_model=APIResponse[dict])
async def delete_file(
    file_id: UUID,
    current_user: User = Depends(require_permission("files", "delete")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    await service.delete(
        id=file_id,
        user_id=current_user.id,
    )

    return success_response(
        data={},
        message="File deleted successfully",
    )


@router.post("/{file_id}/approve", response_model=APIResponse[dict])
async def approve_file(
    file_id: UUID,
    current_user: User = Depends(require_permission("files", "approve")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    await service.approve_file(
        file_id,
        current_user.id,
    )

    return success_response(
        data={},
        message="File approved successfully",
    )


@router.post("/{file_id}/download", response_model=APIResponse[dict])
async def download_file(
    file_id: UUID,
    current_user: User = Depends(require_permission("files", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    await service.increment_download(file_id)

    return success_response(
        data={},
        message="Download count updated",
    )


@router.get("/module/{module_name}", response_model=APIResponse[list[FileResponse]])
async def get_module_files(
    module_name: str,
    current_user: User = Depends(require_permission("files", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    files = await service.get_by_module(module_name)

    return success_response(data=[FileResponse.model_validate(f) for f in files])


@router.get("/entity/{entity_id}", response_model=APIResponse[list[FileResponse]])
async def get_entity_files(
    entity_id: UUID,
    current_user: User = Depends(require_permission("files", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = FileService(db)

    files = await service.get_by_entity(entity_id)

    return success_response(data=[FileResponse.model_validate(f) for f in files])