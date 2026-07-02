from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from datetime import datetime, timezone

from app.models.academic.course import Course
from app.models.academic.program import Program
from app.models.lms.course_module import CourseModule
from app.models.lms.lesson import Lesson

router = APIRouter()


def _map_lesson(lesson) -> dict:
    """Map a Lesson ORM object to the frontend Submodule shape."""
    # Determine type based on properties or defaults
    is_video = bool(lesson.video_url)
    res_url = lesson.video_url if is_video else (lesson.content_html or "")
    
    # Simple heuristic: if content_html contains .pdf or matches PDF type patterns, it's a PDF.
    res_type = "Video" if is_video else "PDF"
    if not is_video and res_url:
        if ".pdf" in res_url.lower() or "/mock-storage/" in res_url.lower():
            res_type = "PDF"
        else:
            res_type = "PDF" # default back to PDF for other documents
            
    return {
        "id": str(lesson.id),
        "title": lesson.title,
        "type": res_type,
        "url": res_url,
        "minReadingTime": 120 if res_type == "PDF" else None,
        "videoDuration": 600 if res_type == "Video" else None,
    }



def _map_module(module) -> dict:
    """Map a CourseModule ORM object to the frontend Module shape."""
    lessons = sorted(module.lessons, key=lambda l: (l.order_index or 0))
    return {
        "id": str(module.id),
        "title": module.title,
        "description": module.description or "",
        "submodules": [_map_lesson(l) for l in lessons],
    }


def _map_course(course, program_name: str, modules: list) -> dict:
    """Map a Course + its modules to the frontend CourseItem shape."""
    sorted_modules = sorted(modules, key=lambda m: (m.order_index or 0))
    return {
        "id": str(course.id),
        "title": course.name,
        "program": program_name,
        "description": course.description or "",
        "thumbnail": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
        "progressRate": 0,
        "studentsCompleted": 0,
        "modules": [_map_module(m) for m in sorted_modules],
    }


@router.get("/courses")
async def get_courses(db: AsyncSession = Depends(get_db)):
    """List all courses with their nested modules and lessons."""
    # Fetch all non-deleted courses, eagerly joining program
    course_stmt = (
        select(Course)
        .join(Program, Course.program_id == Program.id)
        .filter(Course.deleted_at.is_(None))
        .order_by(Course.created_at.desc())
    )
    course_result = await db.execute(course_stmt)
    courses = course_result.scalars().all()

    if not courses:
        return []

    # Fetch all programs for name lookup
    program_ids = list({c.program_id for c in courses})
    prog_stmt = select(Program).filter(Program.id.in_(program_ids))
    prog_result = await db.execute(prog_stmt)
    programs = {p.id: p.name for p in prog_result.scalars().all()}

    # Fetch all course modules with their lessons for these courses
    course_ids = [c.id for c in courses]
    mod_stmt = (
        select(CourseModule)
        .options(selectinload(CourseModule.lessons))
        .filter(CourseModule.course_id.in_(course_ids))
        .filter(CourseModule.deleted_at.is_(None))
    )
    mod_result = await db.execute(mod_stmt)
    all_modules = mod_result.scalars().all()

    # Group modules by course_id
    modules_by_course: dict[str, list] = {}
    for m in all_modules:
        modules_by_course.setdefault(m.course_id, []).append(m)

    return [
        _map_course(c, programs.get(c.program_id, "Unknown"), modules_by_course.get(c.id, []))
        for c in courses
    ]


@router.post("/courses", status_code=201)
async def create_course(payload: dict = Body(...), db: AsyncSession = Depends(get_db)):
    """
    Create a new course with optional nested modules and lessons.
    
    Expected payload shape:
    {
        "title": "Course Name",
        "program": "Software Engineering",  (used to find program_id)
        "description": "...",
        "thumbnail": "...",
        "modules": [
            {
                "title": "Module 1",
                "description": "...",
                "submodules": [
                    {
                        "title": "Lesson 1",
                        "type": "PDF" | "Video",
                        "url": "...",
                        "minReadingTime": 120,
                        "videoDuration": 600
                    }
                ]
            }
        ]
    }
    """
    title = payload.get("title")
    description = payload.get("description", "")
    program_name = payload.get("program", "")

    if not title:
        raise HTTPException(status_code=400, detail="Course title is required")

    # Find a matching program by name, or use the first available
    program = None
    if program_name:
        prog_stmt = select(Program).filter(Program.name.ilike(f"%{program_name}%")).limit(1)
        prog_result = await db.execute(prog_stmt)
        program = prog_result.scalars().first()
    
    if not program:
        # Fallback to first available program
        prog_stmt = select(Program).limit(1)
        prog_result = await db.execute(prog_stmt)
        program = prog_result.scalars().first()

    if not program:
        raise HTTPException(status_code=400, detail="No programs exist in the system. Please create a program first.")

    # Generate a course code
    import time
    course_code = f"CRS-{int(time.time()) % 100000}"

    # Create the course
    course = Course(
        program_id=program.id,
        name=title,
        code=course_code,
        description=description,
    )
    db.add(course)
    await db.flush()
    await db.refresh(course)

    # Create nested modules and lessons
    modules_data = payload.get("modules", [])
    created_modules = []
    for idx, mod_data in enumerate(modules_data):
        module = CourseModule(
            course_id=course.id,
            title=mod_data.get("title", f"Module {idx + 1}"),
            description=mod_data.get("description", ""),
            order_index=idx,
        )
        db.add(module)
        await db.flush()
        await db.refresh(module)

        # Create lessons/submodules
        for s_idx, sub_data in enumerate(mod_data.get("submodules", [])):
            sub_type = sub_data.get("type", "PDF")
            lesson = Lesson(
                module_id=module.id,
                title=sub_data.get("title", f"Lesson {s_idx + 1}"),
                content_html=None if sub_type == "Video" else sub_data.get("url", ""),
                video_url=sub_data.get("url", "") if sub_type == "Video" else None,
                order_index=s_idx,
            )
            db.add(lesson)


    # Query Course with selectinload for CourseModule and Lesson to ensure all attributes are eagerly loaded in the same transaction
    await db.commit()


    # Re-fetch course with full nested structures eagerly loaded
    refreshed_course_stmt = (
        select(Course)
        .filter(Course.id == course.id)
    )
    course_res = await db.execute(refreshed_course_stmt)
    refreshed_course = course_res.scalars().first()

    stmt = (
        select(CourseModule)
        .options(selectinload(CourseModule.lessons))
        .filter(CourseModule.course_id == course.id)
    )
    mod_result = await db.execute(stmt)
    refreshed_modules = list(mod_result.scalars().all())

    # Map details manually to avoid any lazy loading trigger on refreshed_course
    return {
        "id": str(refreshed_course.id),
        "title": refreshed_course.name,
        "program": program.name,
        "description": refreshed_course.description or "",
        "thumbnail": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
        "progressRate": 0,
        "studentsCompleted": 0,
        "modules": [_map_module(m) for m in sorted(refreshed_modules, key=lambda m: m.order_index or 0)],
    }






@router.put("/courses/{course_id}", status_code=200)
async def update_course(course_id: str, payload: dict = Body(...), db: AsyncSession = Depends(get_db)):
    """
    Update course details, modules, and submodules (lessons).
    """
    from uuid import UUID
    try:
        cid = UUID(course_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid course ID")

    # Find the course
    stmt = select(Course).filter(Course.id == cid, Course.deleted_at.is_(None))
    result = await db.execute(stmt)
    course = result.scalars().first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    title = payload.get("title")
    description = payload.get("description", "")
    program_name = payload.get("program", "")

    if not title:
        raise HTTPException(status_code=400, detail="Course title is required")

    # Find program
    program = None
    if program_name:
        prog_stmt = select(Program).filter(Program.name.ilike(f"%{program_name}%")).limit(1)
        prog_result = await db.execute(prog_stmt)
        program = prog_result.scalars().first()
    
    if not program:
        prog_stmt = select(Program).limit(1)
        prog_result = await db.execute(prog_stmt)
        program = prog_result.scalars().first()

    # Update course fields
    course.name = title
    course.description = description
    if program:
        course.program_id = program.id
    db.add(course)

    # Delete existing course modules and lessons to rewrite them easily
    del_mod_stmt = select(CourseModule).filter(CourseModule.course_id == course.id)
    del_mod_res = await db.execute(del_mod_stmt)
    existing_mods = del_mod_res.scalars().all()
    for em in existing_mods:
        await db.delete(em)
    await db.flush()

    # Create new modules and lessons
    modules_data = payload.get("modules", [])
    created_modules = []
    for idx, mod_data in enumerate(modules_data):
        module = CourseModule(
            course_id=course.id,
            title=mod_data.get("title", f"Module {idx + 1}"),
            description=mod_data.get("description", ""),
            order_index=idx,
        )
        db.add(module)
        await db.flush()
        await db.refresh(module)

        # Create lessons/submodules
        for s_idx, sub_data in enumerate(mod_data.get("submodules", [])):
            sub_type = sub_data.get("type", "PDF")
            lesson = Lesson(
                module_id=module.id,
                title=sub_data.get("title", f"Lesson {s_idx + 1}"),
                content_html=None if sub_type == "Video" else sub_data.get("url", ""),
                video_url=sub_data.get("url", "") if sub_type == "Video" else None,
                order_index=s_idx,
            )
            db.add(lesson)


        created_modules.append(module)

    await db.commit()

    # Re-fetch course with full nested structures eagerly loaded
    refreshed_course_stmt = (
        select(Course)
        .filter(Course.id == course.id)
    )
    course_res = await db.execute(refreshed_course_stmt)
    refreshed_course = course_res.scalars().first()

    stmt = (
        select(CourseModule)
        .options(selectinload(CourseModule.lessons))
        .filter(CourseModule.course_id == course.id)
    )
    mod_result = await db.execute(stmt)
    refreshed_modules = list(mod_result.scalars().all())

    # Map details manually
    return {
        "id": str(refreshed_course.id),
        "title": refreshed_course.name,
        "program": program.name if program else "Unknown",
        "description": refreshed_course.description or "",
        "thumbnail": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
        "progressRate": 0,
        "studentsCompleted": 0,
        "modules": [_map_module(m) for m in sorted(refreshed_modules, key=lambda m: m.order_index or 0)],
    }


@router.delete("/courses/{course_id}")
async def delete_course(course_id: str, db: AsyncSession = Depends(get_db)):
    """Soft-delete a course by setting deleted_at."""
    from uuid import UUID
    try:
        cid = UUID(course_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid course ID")

    stmt = select(Course).filter(Course.id == cid, Course.deleted_at.is_(None))
    result = await db.execute(stmt)
    course = result.scalars().first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    course.deleted_at = datetime.now(timezone.utc)
    db.add(course)
    await db.commit()

    return {"detail": "Course deleted successfully", "id": str(course.id)}


# Keep backward-compatible root endpoint
@router.get("/")
async def get_lms_list(db: AsyncSession = Depends(get_db)):
    return await get_courses(db=db)
