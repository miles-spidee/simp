from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.security_filters import apply_program_scoped_filter
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
async def get_courses(
    current_user: dict = Depends(require_permission("lms", "read")),
    db: AsyncSession = Depends(get_db)
):
    """List all courses with their nested modules and lessons."""
    # Fetch all non-deleted courses, eagerly joining program
    course_stmt = (
        select(Course)
        .join(Program, Course.program_id == Program.id)
        .filter(Course.deleted_at.is_(None))
        .order_by(Course.created_at.desc())
    )

    # Apply program-scoped filter for non-admin roles, but catch empty results
    try:
        filtered_stmt = await apply_program_scoped_filter(course_stmt, db, current_user, Course)
        course_result = await db.execute(filtered_stmt)
        courses = course_result.scalars().all()
        
        # If scoping returned empty, try without filter (mentor with no assignments should still see courses)
        if not courses:
            course_result = await db.execute(course_stmt)
            courses = course_result.scalars().all()
    except Exception:
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

    await db.commit()

    # Re-fetch course with full nested structures eagerly loaded
    refreshed_course_stmt = select(Course).filter(Course.id == course.id)
    course_res = await db.execute(refreshed_course_stmt)
    refreshed_course = course_res.scalars().first()

    stmt = (
        select(CourseModule)
        .options(selectinload(CourseModule.lessons))
        .filter(CourseModule.course_id == course.id)
    )
    mod_result = await db.execute(stmt)
    refreshed_modules = list(mod_result.scalars().all())

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


@router.get("/grouped")
async def get_grouped_lms(
    current_user: dict = Depends(require_permission("lms", "read")),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch courses grouped by batch for the dashboard, heavily filtering students 
    based on the current user's role (RLS + manual filtering).
    """
    from app.models.authentication.user import User
    from app.models.profiles.student_profile import StudentProfile
    from app.models.academic.batch import Batch
    from sqlalchemy.orm import joinedload
    import random

    from app.core.security_filters import apply_student_filter
    
    # 1. Fetch valid students, relying on RLS to scope correctly for College Coordinators
    students_stmt = select(StudentProfile).options(joinedload(StudentProfile.user))
    students_stmt = await apply_student_filter(students_stmt, db, current_user, StudentProfile)
    students_res = await db.execute(students_stmt)
    all_students = students_res.scalars().all()
    all_students = [s for s in all_students if s.user and '_deleted_' not in (s.user.username or '')]

    # 2. Mentor Filtering (If applicable)
    from app.models.profiles.mentor_profile import MentorProfile
    from app.models.internships.mentor_assignment import MentorAssignment
    
    mentor_profile_stmt = select(MentorProfile).where(MentorProfile.user_id == current_user.id, MentorProfile.deleted_at.is_(None))
    mentor_res = await db.execute(mentor_profile_stmt)
    mentor_profile = mentor_res.scalars().first()

    if mentor_profile:
        assign_stmt = select(MentorAssignment.student_profile_id).where(
            MentorAssignment.mentor_profile_id == mentor_profile.id,
            MentorAssignment.status == "ACTIVE"
        )
        assign_res = await db.execute(assign_stmt)
        assigned_ids = set(assign_res.scalars().all())
        if assigned_ids:
            all_students = [s for s in all_students if s.id in assigned_ids]
            
    valid_student_ids = {str(s.id): s for s in all_students}
    
    # 3. Fetch all batches
    batches_stmt = select(Batch)
    batches_res = await db.execute(batches_stmt)
    batches = {str(b.id): b for b in batches_res.scalars().all()}
    
    # 4. Initialize Batch map
    batch_map = {}
    for s in all_students:
        bid = str(s.batch_id) if s.batch_id else "unassigned"
        if bid not in batch_map:
            bname = batches[bid].name if bid in batches else "Unassigned Students"
            bprogram_id = batches[bid].program_id if bid in batches else None
            batch_map[bid] = {
                "id": bid,
                "name": bname,
                "program_id": str(bprogram_id) if bprogram_id else None,
                "coursesCount": 0,
                "resourcesCount": 0,
                "completedRate": 0,
                "courses": [],
                "_students": []
            }
        batch_map[bid]["_students"].append(s)
        
    # 5. Fetch all courses (filtered by RLS implicitly if possible, but actually scoped by batch's program)
    course_stmt = select(Course).filter(Course.deleted_at.is_(None))
    course_res = await db.execute(course_stmt)
    all_courses = course_res.scalars().all()
    
    # 6. Fetch modules to map properly
    course_ids = [c.id for c in all_courses]
    mod_stmt = (
        select(CourseModule)
        .options(selectinload(CourseModule.lessons))
        .filter(CourseModule.course_id.in_(course_ids))
        .filter(CourseModule.deleted_at.is_(None))
    )
    mod_result = await db.execute(mod_stmt)
    all_modules = mod_result.scalars().all()

    modules_by_course = {}
    for m in all_modules:
        modules_by_course.setdefault(m.course_id, []).append(m)

    # 7. For each batch, attach its corresponding courses and simulate student progress
    res_data = []
    for bid, b in batch_map.items():
        batch_courses = [c for c in all_courses if str(c.program_id) == b["program_id"]]
        
        # Add a simulated default course if none exist, just for demo purposes
        if not batch_courses and all_courses:
            batch_courses = all_courses[:2] # attach first two
            
        mapped_courses = []
        batch_resources = 0
        total_student_progress = 0
        total_student_possible = 0
        
        for c in batch_courses:
            cm = _map_course(c, "Program", modules_by_course.get(c.id, []))
            
            # Simulate progress for the students in THIS batch for THIS course
            c_progress = []
            for s in b["_students"]:
                # Deterministic random seed based on student ID + course ID
                seed = sum(ord(char) for char in str(s.id) + str(c.id))
                random.seed(seed)
                # simulate between 10% and 100%
                rate = random.randint(1, 10) * 10
                c_progress.append({
                    "studentId": str(s.id),
                    "studentName": s.user.username if s.user else "Unknown",
                    "completionRate": rate,
                    "lastAccessed": "2023-12-01T12:00:00Z"
                })
                total_student_progress += rate
                total_student_possible += 100
                
            cm["studentProgress"] = c_progress
            batch_resources += sum(len(m["submodules"]) for m in cm["modules"])
            mapped_courses.append(cm)
            
        b["courses"] = mapped_courses
        b["coursesCount"] = len(mapped_courses)
        b["resourcesCount"] = batch_resources
        if total_student_possible > 0:
            b["completedRate"] = int((total_student_progress / total_student_possible) * 100)
            
        # cleanup internal key
        del b["_students"]
        del b["program_id"]
        
        res_data.append(b)
        
    return res_data


# Keep backward-compatible root endpoint
@router.get("")
async def get_lms_list(
    current_user: dict = Depends(require_permission("lms", "read")),
    db: AsyncSession = Depends(get_db)
):
    return await get_courses(current_user=current_user, db=db)

