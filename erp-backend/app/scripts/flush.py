from __future__ import annotations

import argparse
import asyncio
from dataclasses import dataclass
from heapq import heappop, heappush
from typing import Iterable, Sequence

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401 - ensure every mapped model is registered
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.authentication.user import User
from app.models.core.base import Base
from app.models.rbac.role import Role
from app.models.rbac.user_role import UserRole


PRESERVED_TABLES = {
    "rbac_actions",
    "rbac_features",
    "rbac_modules",
    "rbac_permission_group_permissions",
    "rbac_permission_groups",
    "rbac_permissions",
    "rbac_role_permission_groups",
    "rbac_role_permissions",
    "rbac_roles",
    "ref_blood_groups",
    "ref_cities",
    "ref_countries",
    "ref_currencies",
    "ref_document_types",
    "ref_genders",
    "ref_languages",
    "ref_notification_types",
    "ref_states",
    "ref_timezones",
    "sys_idcard_templates",
    "sys_document_templates",
    "sys_settings",
    "comm_email_templates",
    "sup_faqs",
}

MODULE_PREFIXES = {
    "authentication": ("auth_",),
    "rbac": ("rbac_",),
    "reference": ("ref_",),
    "organizations": ("org_",),
    "academic": ("acad_",),
    "companies": ("comp_",),
    "profiles": ("profile_",),
    "internships": ("intern_",),
    "lms": ("lms_",),
    "hr": ("hr_",),
    "communication": ("comm_",),
    "finance": ("fin_",),
    "system": ("sys_",),
    "support": ("sup_",),
    "analytics": ("analytics_",),
    "alumni_placements": ("alum_",),
}

MODULE_ALIASES = {
    "auth": "authentication",
    "identity": "authentication",
    "organization": "organizations",
    "org": "organizations",
    "program": "academic",
    "academics": "academic",
    "company": "companies",
    "profile": "profiles",
    "student": "profiles",
    "students": "profiles",
    "employee": "profiles",
    "mentor": "profiles",
    "intern": "internships",
    "opportunity": "internships",
    "application": "internships",
    "allocation": "internships",
    "task": "internships",
    "attendance": "internships",
    "assessment": "internships",
    "submission": "internships",
    "certificate": "internships",
    "learning": "lms",
    "lms_management": "lms",
    "hr": "hr",
    "leave": "hr",
    "performance": "hr",
    "message": "communication",
    "communication": "communication",
    "email": "communication",
    "announcement": "communication",
    "calendar": "communication",
    "finance": "finance",
    "payment": "finance",
    "payments": "finance",
    "fee": "finance",
    "invoice": "finance",
    "receipt": "finance",
    "wallet": "finance",
    "system": "system",
    "document": "system",
    "idcard": "system",
    "verification": "system",
    "support": "support",
    "helpdesk": "support",
    "ticket": "support",
    "faq": "support",
    "analytics": "analytics",
    "dashboard": "analytics",
    "report": "analytics",
    "reports": "analytics",
    "kpi": "analytics",
    "executive": "analytics",
    "export": "analytics",
    "alumni": "alumni_placements",
    "placement": "alumni_placements",
}


@dataclass(slots=True)
class FlushResult:
    dry_run: bool
    tables: list[str]
    row_counts: dict[str, int]
    protected_super_admin_ids: list[str]

    @property
    def total_rows(self) -> int:
        return sum(self.row_counts.values())


def normalize_token(value: str) -> str:
    return value.strip().lower().replace("-", "_").replace(" ", "_")


def parse_requested_modules(values: Sequence[str] | None) -> list[str]:
    if not values:
        return []

    parsed: list[str] = []
    for raw_value in values:
        for item in raw_value.split(","):
            token = normalize_token(item)
            if token:
                parsed.append(token)
    return parsed


def available_module_names() -> list[str]:
    return sorted(MODULE_PREFIXES)


def resolve_module_name(value: str) -> str:
    token = normalize_token(value)
    return MODULE_ALIASES.get(token, token)


def tables_for_module(module_name: str) -> set[str]:
    prefixes = MODULE_PREFIXES.get(module_name)
    if prefixes is None:
        raise KeyError(module_name)

    table_names: set[str] = set()
    for table_name in Base.metadata.tables:
        if any(table_name.startswith(prefix) for prefix in prefixes):
            table_names.add(table_name)
    return table_names


def build_dependency_graph(table_names: Iterable[str]) -> tuple[dict[str, set[str]], dict[str, set[str]]]:
    tables = set(table_names)
    dependents = {table_name: set() for table_name in tables}
    parents = {table_name: set() for table_name in tables}

    for table_name in tables:
        table = Base.metadata.tables[table_name]
        for foreign_key in table.foreign_keys:
            parent_table = foreign_key.column.table.name
            if parent_table in tables:
                dependents[parent_table].add(table_name)
                parents[table_name].add(parent_table)

    return dependents, parents


def expand_dependency_closure(root_tables: Iterable[str], dependents: dict[str, set[str]]) -> set[str]:
    selected = set(root_tables)
    stack = list(root_tables)

    while stack:
        current = stack.pop()
        for child in dependents.get(current, set()):
            if child not in selected and child not in PRESERVED_TABLES:
                selected.add(child)
                stack.append(child)

    return selected


def topological_delete_order(
    selected_tables: Iterable[str],
    dependents: dict[str, set[str]],
    parents: dict[str, set[str]],
) -> list[str]:
    selected = set(selected_tables)
    remaining_dependents = {
        table_name: {child for child in dependents[table_name] if child in selected}
        for table_name in selected
    }
    incoming_parents = {
        table_name: {parent for parent in parents[table_name] if parent in selected}
        for table_name in selected
    }

    heap: list[str] = []
    for table_name, children in remaining_dependents.items():
        if not children:
            heappush(heap, table_name)

    order: list[str] = []
    while heap:
        current = heappop(heap)
        order.append(current)

        for parent in incoming_parents[current]:
            children = remaining_dependents[parent]
            if current in children:
                children.remove(current)
                if not children:
                    heappush(heap, parent)

    if len(order) != len(selected):
        unresolved = sorted(selected.difference(order))
        raise RuntimeError(
            "Unable to derive a safe delete order for these tables: "
            + ", ".join(unresolved)
        )

    return order


async def get_protected_super_admin_ids(session: AsyncSession) -> list[str]:
    statement = (
        select(User.id)
        .join(UserRole, UserRole.user_id == User.id)
        .join(Role, Role.id == UserRole.role_id)
        .where(Role.code == "SUPER_ADMIN")
        .distinct()
    )
    result = await session.scalars(statement)
    return [str(user_id) for user_id in result.all()]


def count_statement(table_name: str, protected_super_admin_ids: Sequence[str]):
    table = Base.metadata.tables[table_name]
    statement = select(func.count()).select_from(table)
    if table_name == "auth_users" and protected_super_admin_ids:
        statement = statement.where(~table.c.id.in_(protected_super_admin_ids))
    return statement


def delete_statement(table_name: str, protected_super_admin_ids: Sequence[str]):
    table = Base.metadata.tables[table_name]
    statement = delete(table)
    if table_name == "auth_users" and protected_super_admin_ids:
        statement = statement.where(~table.c.id.in_(protected_super_admin_ids))
    return statement


async def run_flush(
    *,
    modules: Sequence[str] | None,
    dry_run: bool,
    force: bool,
    verbose: bool,
) -> FlushResult:
    raw_modules = parse_requested_modules(modules)
    resolved_modules = [resolve_module_name(module) for module in raw_modules]

    unknown_modules = sorted(
        module for module in resolved_modules if module not in MODULE_PREFIXES
    )
    if unknown_modules:
        raise ValueError(
            "Unknown module(s): "
            + ", ".join(unknown_modules)
            + ". Available modules: "
            + ", ".join(available_module_names())
        )

    all_tables = set(Base.metadata.tables)
    available_deletable_tables = all_tables.difference(PRESERVED_TABLES)

    if resolved_modules:
        requested_roots: set[str] = set()
        for module_name in resolved_modules:
            requested_roots.update(tables_for_module(module_name))
        requested_roots = requested_roots.difference(PRESERVED_TABLES)
    else:
        requested_roots = set(available_deletable_tables)

    dependents, parents = build_dependency_graph(available_deletable_tables)
    selected_tables = expand_dependency_closure(requested_roots, dependents)
    delete_order = topological_delete_order(selected_tables, dependents, parents)

    if verbose:
        print(f"[flush] environment={settings.APP_ENV}")
        print(f"[flush] dry_run={dry_run}")
        if resolved_modules:
            print(f"[flush] requested modules={', '.join(sorted(set(resolved_modules)))}")
        print(f"[flush] protected tables={len(PRESERVED_TABLES)}")
        print(f"[flush] selected tables={len(delete_order)}")

    async with AsyncSessionLocal() as session:
        protected_super_admin_ids = await get_protected_super_admin_ids(session)

        row_counts: dict[str, int] = {}

        async with session.begin():
            for table_name in delete_order:
                count_query = count_statement(table_name, protected_super_admin_ids)
                row_count = int(await session.scalar(count_query) or 0)

                action = "would delete" if dry_run else "deleting"
                print(f"[flush] {action} {row_count} rows from {table_name}")

                row_counts[table_name] = row_count

                if dry_run:
                    continue

                result = await session.execute(
                    delete_statement(table_name, protected_super_admin_ids)
                )
                row_counts[table_name] = int(result.rowcount or 0)

        return FlushResult(
            dry_run=dry_run,
            tables=delete_order,
            row_counts=row_counts,
            protected_super_admin_ids=protected_super_admin_ids,
        )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Safely flush seeded and business data while preserving configuration tables."
    )
    parser.add_argument(
        "--modules",
        nargs="*",
        help="Optional module names to flush. Accepts space-separated or comma-separated values.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview deletions without modifying data.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Confirm destructive execution. Required for actual deletes.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print detailed planning and per-table delete statistics.",
    )
    return parser


async def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    dry_run = args.dry_run or not args.force

    if settings.is_production and not dry_run:
        print("[flush] Refusing to execute destructive flush in production without --force.")
        print("[flush] Re-run with --dry-run to preview or --force to confirm deletion.")
        return

    if not args.force and not args.dry_run:
        print("[flush] Dry-run mode is active by default. Pass --force to execute deletions.")

    result = await run_flush(
        modules=args.modules,
        dry_run=dry_run,
        force=args.force,
        verbose=args.verbose,
    )

    print("[flush] Summary")
    print(f"[flush] mode={'dry-run' if result.dry_run else 'execute'}")
    print(f"[flush] tables={len(result.tables)}")
    print(f"[flush] rows={result.total_rows}")
    if result.protected_super_admin_ids:
        print(
            f"[flush] preserved super admin users={len(result.protected_super_admin_ids)}"
        )


if __name__ == "__main__":
    asyncio.run(main())