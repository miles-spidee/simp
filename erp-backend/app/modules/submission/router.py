from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.responses import success_response
from app.models.internships.task import Task
import uuid

router = APIRouter()

@router.get("")
async def get_submissions(db: AsyncSession = Depends(get_db)):
    try:
        # For submissions, fetch tasks that have a submission or are in review/completed
        stmt = select(Task).where(Task.status.in_(["IN_REVIEW", "COMPLETED", "SUBMITTED"]))
        res = await db.execute(stmt)
        tasks = res.scalars().all()
        
        data = []
        for t in tasks:
            data.append({
                "id": str(t.id),
                "studentId": "STU-Unknown", # Would need joins to get actual student
                "taskId": str(t.id),
                "status": t.status,
                "repoLink": t.submission_url or "",
                "liveLink": "",
                "subtasks": [],
                "commits": [],
                "marksObtained": None,
                "fileIds": []
            })
        return success_response(data=data)
    except Exception as e:
        return success_response(data=[])

@router.get("/{id}")
async def get_submission(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    try:
        t = await db.scalar(select(Task).where(Task.id == id))
        if not t:
            raise HTTPException(status_code=404, detail="Not found")
        return success_response(data={
            "id": str(t.id),
            "studentId": "STU-Unknown",
            "taskId": str(t.id),
            "status": t.status,
            "repoLink": t.submission_url or "",
            "liveLink": "",
            "subtasks": [],
            "commits": [],
            "marksObtained": None,
            "fileIds": []
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def create_submission(data: dict, db: AsyncSession = Depends(get_db)):
    # Assuming this updates a task's submission url
    try:
        task_id = data.get("taskId")
        if task_id:
            t = await db.scalar(select(Task).where(Task.id == uuid.UUID(task_id)))
            if t:
                repo = data.get("repoLink", "")
                deploy = data.get("deployUrl", "")
                video = data.get("videoUrl", "")
                screenshot = data.get("screenshot", "")
                t.submission_url = f"{repo}|{deploy}|{video}|{screenshot}"
                t.status = "SUBMITTED"
                await db.commit()
                return success_response(data=data)
        return success_response(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{id}")
async def update_submission(id: uuid.UUID, updates: dict, db: AsyncSession = Depends(get_db)):
    try:
        t = await db.scalar(select(Task).where(Task.id == id))
        if t:
            if "status" in updates:
                t.status = updates["status"]
            if "repoLink" in updates:
                t.submission_url = updates["repoLink"]
            await db.commit()
            return success_response(data={"status": t.status})
        raise HTTPException(status_code=404, detail="Not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
