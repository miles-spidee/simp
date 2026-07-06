from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.core.responses import success_response
from app.core.dependencies import get_current_user
from app.models.authentication.user import User
from app.models.support.productivity import PersonalTask, StickyNote, Bookmark
import uuid

router = APIRouter()


# ---------- helpers ----------

def _serialize_task(t: PersonalTask) -> dict:
    return {
        "id": str(t.id),
        "title": t.title,
        "completed": t.completed,
        "dueDate": t.due_date or "",
    }

def _serialize_note(n: StickyNote) -> dict:
    return {
        "id": str(n.id),
        "content": n.content,
        "color": n.color,
        "createdAt": n.created_at.isoformat() if n.created_at else "",
    }

def _serialize_bookmark(b: Bookmark) -> dict:
    return {
        "id": str(b.id),
        "title": b.title,
        "url": b.url,
        "category": b.category,
    }


# ---------- workspace ----------

@router.get("")
async def get_workspace(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the user's full productivity workspace."""
    uid = current_user.id

    tasks_result = await db.execute(
        select(PersonalTask)
        .where(PersonalTask.user_id == uid, PersonalTask.deleted_at.is_(None))
        .order_by(desc(PersonalTask.created_at))
    )
    tasks = [_serialize_task(t) for t in tasks_result.scalars().all()]

    notes_result = await db.execute(
        select(StickyNote)
        .where(StickyNote.user_id == uid, StickyNote.deleted_at.is_(None))
        .order_by(desc(StickyNote.created_at))
    )
    notes = [_serialize_note(n) for n in notes_result.scalars().all()]

    bookmarks_result = await db.execute(
        select(Bookmark)
        .where(Bookmark.user_id == uid, Bookmark.deleted_at.is_(None))
        .order_by(desc(Bookmark.created_at))
    )
    bookmarks = [_serialize_bookmark(b) for b in bookmarks_result.scalars().all()]

    return success_response(data={
        "tasks": tasks,
        "notes": notes,
        "bookmarks": bookmarks,
    })


# ---------- tasks ----------

@router.post("/tasks")
async def create_task(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    body = await request.json()
    task = PersonalTask(
        user_id=current_user.id,
        title=body.get("title", "Untitled Task"),
        completed=False,
        due_date=body.get("dueDate", ""),
        version_id=1,
    )
    db.add(task)
    await db.flush()
    return success_response(data=_serialize_task(task), message="Task created")


@router.patch("/tasks/{task_id}")
async def update_task(
    task_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        tid = uuid.UUID(task_id)
    except ValueError:
        return success_response(data=None, message="Invalid task ID")

    task = await db.get(PersonalTask, tid)
    if not task or task.deleted_at or task.user_id != current_user.id:
        return success_response(data=None, message="Task not found")

    body = await request.json()
    if "completed" in body:
        task.completed = body["completed"]
    if "title" in body:
        task.title = body["title"]
    task.version_id = (task.version_id or 1) + 1
    await db.flush()
    return success_response(data=_serialize_task(task), message="Task updated")


@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        tid = uuid.UUID(task_id)
    except ValueError:
        return success_response(data=None, message="Invalid task ID")

    task = await db.get(PersonalTask, tid)
    if not task or task.deleted_at or task.user_id != current_user.id:
        return success_response(data=None, message="Task not found")

    import datetime as dt
    task.deleted_at = dt.datetime.now(dt.timezone.utc)
    task.version_id = (task.version_id or 1) + 1
    await db.flush()
    return success_response(data={"id": str(tid)}, message="Task deleted")


# ---------- notes ----------

@router.post("/notes")
async def create_note(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    body = await request.json()
    note = StickyNote(
        user_id=current_user.id,
        content=body.get("content", ""),
        color=body.get("color", "yellow"),
        version_id=1,
    )
    db.add(note)
    await db.flush()
    return success_response(data=_serialize_note(note), message="Note created")


@router.patch("/notes/{note_id}")
async def update_note(
    note_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        nid = uuid.UUID(note_id)
    except ValueError:
        return success_response(data=None, message="Invalid note ID")

    note = await db.get(StickyNote, nid)
    if not note or note.deleted_at or note.user_id != current_user.id:
        return success_response(data=None, message="Note not found")

    body = await request.json()
    if "content" in body:
        note.content = body["content"]
    if "color" in body:
        note.color = body["color"]
    note.version_id = (note.version_id or 1) + 1
    await db.flush()
    return success_response(data=_serialize_note(note), message="Note updated")


@router.delete("/notes/{note_id}")
async def delete_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        nid = uuid.UUID(note_id)
    except ValueError:
        return success_response(data=None, message="Invalid note ID")

    note = await db.get(StickyNote, nid)
    if not note or note.deleted_at or note.user_id != current_user.id:
        return success_response(data=None, message="Note not found")

    import datetime as dt
    note.deleted_at = dt.datetime.now(dt.timezone.utc)
    note.version_id = (note.version_id or 1) + 1
    await db.flush()
    return success_response(data={"id": str(nid)}, message="Note deleted")


# ---------- bookmarks ----------

@router.post("/bookmarks")
async def create_bookmark(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    body = await request.json()
    bm = Bookmark(
        user_id=current_user.id,
        title=body.get("title", "Untitled"),
        url=body.get("url", ""),
        category=body.get("category", "Work"),
        version_id=1,
    )
    db.add(bm)
    await db.flush()
    return success_response(data=_serialize_bookmark(bm), message="Bookmark created")


@router.delete("/bookmarks/{bookmark_id}")
async def delete_bookmark(
    bookmark_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        bid = uuid.UUID(bookmark_id)
    except ValueError:
        return success_response(data=None, message="Invalid bookmark ID")

    bm = await db.get(Bookmark, bid)
    if not bm or bm.deleted_at or bm.user_id != current_user.id:
        return success_response(data=None, message="Bookmark not found")

    import datetime as dt
    bm.deleted_at = dt.datetime.now(dt.timezone.utc)
    bm.version_id = (bm.version_id or 1) + 1
    await db.flush()
    return success_response(data={"id": str(bid)}, message="Bookmark deleted")
