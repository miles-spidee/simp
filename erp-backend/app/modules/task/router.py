from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.responses import success_response, APIResponse
from app.models.internships.task import Task
from app.models.internships.mentor_assignment import MentorAssignment
from app.models.profiles.student_profile import StudentProfile
from app.models.academic.batch import Batch
from sqlalchemy.orm import joinedload
import datetime
import uuid
from typing import List

router = APIRouter()

from app.core.dependencies import get_current_user, require_permission
from app.models.authentication.user import User

@router.get("", response_model=APIResponse[List[dict]])
async def get_task_list(
    current_user: User = Depends(require_permission("tasks", "read")),
    db: AsyncSession = Depends(get_db)
):
    from app.core.security_filters import apply_student_filter
    try:
        stmt = select(Task).options(
            joinedload(Task.assignment).joinedload(MentorAssignment.student_profile)
        ).join(MentorAssignment, Task.assignment_id == MentorAssignment.id).join(StudentProfile, MentorAssignment.student_profile_id == StudentProfile.id)
        
        stmt = await apply_student_filter(stmt, db, current_user, StudentProfile)
        result = await db.execute(stmt)
        tasks = result.scalars().all()
        data = []
        for t in tasks:
            status_upper = t.status.upper() if t.status else ""
            if status_upper in ("COMPLETED", "CLOSED", "GRADED"):
                status_mapped = "completed"
            elif status_upper in ("IN_REVIEW", "REVIEW", "SUBMITTED"):
                status_mapped = "review"
            else:
                status_mapped = "pending"
                
            batch_id = "batch-ai-2026"
            if t.assignment and t.assignment.student_profile and t.assignment.student_profile.batch_id:
                batch_id = str(t.assignment.student_profile.batch_id)
                
            due_date_str = t.due_date.isoformat() if t.due_date else ""
            assigned_date_str = t.created_at.date().isoformat() if t.created_at else "2026-06-01"
            
            is_overdue = False
            if t.due_date and status_mapped == "pending":
                is_overdue = t.due_date < datetime.date.today()
                
            data.append({
                "id": str(t.id),
                "title": t.title,
                "description": t.description,
                "batchId": batch_id,
                "assignedBy": "Super Admin",
                "assignedDate": assigned_date_str,
                "dueDate": due_date_str,
                "status": status_mapped,
                "isOverdue": is_overdue,
                "isLocked": False
            })
        return success_response(data=data)
    except Exception as e:
        return success_response(data=[])


@router.get("/grouped")
async def get_grouped_tasks(
    current_user: User = Depends(require_permission("tasks", "read")),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get all tasks, grouping them by title for Batch view
        stmt = select(Task).options(
            joinedload(Task.assignment).joinedload(MentorAssignment.student_profile).joinedload(StudentProfile.user)
        )
        result = await db.execute(stmt)
        tasks = result.scalars().all()
        
        # We also need batch details
        batch_stmt = select(Batch)
        batch_res = await db.execute(batch_stmt)
        batches = {str(b.id): b.name for b in batch_res.scalars().all()}
        
        batch_groups = {}
        for t in tasks:
            if not t.assignment or not t.assignment.student_profile:
                continue
            
            bid = str(t.assignment.student_profile.batch_id)
            if bid not in batches:
                continue
                
            b_name = batches[bid]
            
            if bid not in batch_groups:
                batch_groups[bid] = {
                    "id": bid,
                    "name": b_name,
                    "totalTasks": 0,
                    "overallSubmissionRate": 0,
                    "overdueCount": 0,
                    "tasks": {}
                }
                
            if t.title not in batch_groups[bid]["tasks"]:
                batch_groups[bid]["tasks"][t.title] = {
                    "id": str(t.id), # just pick the first one's id for grouping
                    "title": t.title,
                    "description": t.description,
                    "dueDate": t.due_date.isoformat() if t.due_date else "",
                    "attempts": 1,
                    "requirements": [],
                    "submissions": []
                }
                
            # determine status
            st = "Pending"
            if t.status in ("SUBMITTED", "GRADED", "COMPLETED"):
                st = "Submitted"
            elif t.due_date and t.due_date < datetime.date.today():
                st = "Overdue"
                
            score = 0
            if t.status == "GRADED" and t.feedback and "score:" in t.feedback:
                # hack to extract score from feedback for simplicity
                try:
                    score = int(t.feedback.split("score:")[1].split(",")[0].strip())
                except:
                    pass
                
            batch_groups[bid]["tasks"][t.title]["submissions"].append({
                "studentId": str(t.assignment.student_profile.id),
                "studentName": t.assignment.student_profile.user.username if t.assignment and t.assignment.student_profile and t.assignment.student_profile.user else "Student",
                "status": st,
                "score": score,
                "submittedAt": t.updated_at.isoformat() if t.updated_at else "",
                "taskId": str(t.id) # the actual task id for grading
            })

        # Calculate aggregations
        result_data = []
        for bid, b_data in batch_groups.items():
            task_list = list(b_data["tasks"].values())
            b_data["totalTasks"] = len(task_list)
            
            total_subs = sum(len(tk["submissions"]) for tk in task_list)
            completed_subs = sum(1 for tk in task_list for sub in tk["submissions"] if sub["status"] == "Submitted")
            
            b_data["overallSubmissionRate"] = round((completed_subs / total_subs * 100)) if total_subs > 0 else 0
            b_data["overdueCount"] = sum(1 for tk in task_list for sub in tk["submissions"] if sub["status"] == "Overdue")
            b_data["tasks"] = task_list
            result_data.append(b_data)
            
        return success_response(data=result_data)
    except Exception as e:
        print("Error getting grouped tasks:", e)
        return success_response(data=[])


@router.post("/bulk")
async def create_bulk_task(
    request: Request,
    current_user: User = Depends(require_permission("tasks", "create")),
    db: AsyncSession = Depends(get_db)
):
    try:
        body = await request.json()
        title = body.get("title")
        description = body.get("description")
        due_date_str = body.get("dueDate")
        batch_id = body.get("batchId") # We might ignore this and assign to all active students for now
        
        due_date = None
        if due_date_str:
            due_date = datetime.date.fromisoformat(due_date_str.split("T")[0])
            
        # Get all mentor assignments to create tasks for everyone
        stmt = select(MentorAssignment)
        res = await db.execute(stmt)
        assignments = res.scalars().all()
        
        for assignment in assignments:
            std_task = Task(
                assignment_id=assignment.id,
                title=title,
                description=description,
                due_date=due_date,
                status="TODO"
            )
            db.add(std_task)
            
        await db.commit()
        return success_response(data={"success": True})
    except Exception as e:
        print("Error creating bulk tasks:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{task_id}/grade")
async def grade_task(
    task_id: str,
    request: Request,
    current_user: User = Depends(require_permission("tasks", "update")),
    db: AsyncSession = Depends(get_db)
):
    try:
        body = await request.json()
        score = body.get("score")
        feedback = body.get("feedback", "")
        
        task = await db.get(Task, uuid.UUID(task_id))
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
            
        task.status = "GRADED"
        task.feedback = f"score:{score}, {feedback}"
        
        await db.commit()
        return success_response(data={"success": True})
    except Exception as e:
        print("Error grading task:", e)
        return success_response(data={"success": False})
