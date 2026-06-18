from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import (
    User,
    Role,
    Permission,
    UserRole,
    RolePermission
)


class UserRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(
        self,
        email: str
    ) -> User | None:

        stmt = (
            select(User)
            .options(
                selectinload(User.user_role)
                .selectinload(UserRole.role)
            )
            .where(User.email == email)
        )

        result = await self.db.execute(stmt)

        return result.scalars().first()

    async def get_by_id(
        self,
        user_id: UUID
    ) -> User | None:

        stmt = (
            select(User)
            .options(
                selectinload(User.user_role)
                .selectinload(UserRole.role)
            )
            .where(User.user_id == user_id)
        )

        result = await self.db.execute(stmt)

        return result.scalars().first()

    async def create(
        self,
        user: User
    ):

        self.db.add(user)

        await self.db.commit()

        await self.db.refresh(user)

        return user

    async def update_last_login(
        self,
        user: User
    ):

        await self.db.commit()

        await self.db.refresh(user)

        return user


class RoleRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_name(
        self,
        role_name: str
    ) -> Role | None:

        stmt = select(Role).where(
            Role.role_name == role_name
        )

        result = await self.db.execute(stmt)

        return result.scalars().first()

    async def get_all(self):

        stmt = select(Role)

        result = await self.db.execute(stmt)

        return result.scalars().all()


class PermissionRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):

        stmt = select(Permission)

        result = await self.db.execute(stmt)

        return result.scalars().all()


class UserRoleRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def assign_role(
        self,
        user_id: UUID,
        role_id: UUID
    ):

        user_role = UserRole(
            user_id=user_id,
            role_id=role_id
        )

        self.db.add(user_role)

        await self.db.commit()

        await self.db.refresh(user_role)

        return user_role

    async def get_user_role(
        self,
        user_id: UUID
    ):

        stmt = (
            select(UserRole)
            .options(
                selectinload(UserRole.role)
            )
            .where(
                UserRole.user_id == user_id
            )
        )

        result = await self.db.execute(stmt)

        return result.scalars().first()


class RolePermissionRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_permissions_by_role(
        self,
        role_id: UUID
    ):

        stmt = (
            select(RolePermission)
            .options(
                selectinload(RolePermission.permission)
            )
            .where(
                RolePermission.role_id == role_id
            )
        )

        result = await self.db.execute(stmt)

        return result.scalars().all()