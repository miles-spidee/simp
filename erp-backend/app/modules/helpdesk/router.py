from fastapi import APIRouter, Depends, Request, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_
from app.core.database import get_db
from app.core.responses import success_response
from app.core.dependencies import get_current_user
from app.models.support.helpdesk import Ticket, TicketMessage
from app.models.authentication.user import User
from app.models.rbac.user_role import UserRole
from app.models.rbac.role import Role
from app.models.profiles.student_profile import StudentProfile
from app.models.profiles.employee_profile import EmployeeProfile
from app.models.profiles.mentor_profile import MentorProfile
from app.models.internships.mentor_assignment import MentorAssignment
from app.models.profiles.dept_coordinator_profile import DepartmentCoordinatorProfile
import uuid
import datetime

router = APIRouter()

# ---------- helpers ----------

async def get_roles_by_user_id(db: AsyncSession, user_id: uuid.UUID) -> list[str]:
    stmt = select(Role.code).join(UserRole, UserRole.role_id == Role.id).where(UserRole.user_id == user_id)
    res = await db.execute(stmt)
    return list(res.scalars().all())

async def get_user_roles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> list[str]:
    return await get_roles_by_user_id(db, current_user.id)

async def _serialize_ticket(ticket: Ticket, db: AsyncSession) -> dict:
    """Convert a Ticket ORM object to the frontend-friendly dict."""
    requester = await db.get(User, ticket.requester_user_id)
    requester_name = requester.username if requester else "Unknown"

    assignee_name = None
    if ticket.assigned_user_id:
        assignee = await db.get(User, ticket.assigned_user_id)
        assignee_name = assignee.username if assignee else None

    msg_result = await db.execute(
        select(TicketMessage)
        .where(TicketMessage.ticket_id == ticket.id)
        .order_by(TicketMessage.created_at.asc())
    )
    messages = msg_result.scalars().all()
    comments = []
    for m in messages:
        sender = await db.get(User, m.sender_user_id)
        comments.append({
            "id": str(m.id),
            "ticketId": str(ticket.id),
            "authorId": str(m.sender_user_id),
            "authorName": sender.username if sender else "System",
            "content": m.message,
            "timestamp": m.created_at.isoformat() if m.created_at else "",
            "isInternal": False,
        })

    return {
        "id": str(ticket.id),
        "ticketNumber": ticket.ticket_number,
        "title": ticket.subject,
        "description": ticket.description,
        "category": ticket.category,
        "priority": ticket.priority,
        "status": ticket.status,
        "createdBy": str(ticket.requester_user_id),
        "creatorName": requester_name,
        "assignedTo": str(ticket.assigned_user_id) if ticket.assigned_user_id else None,
        "assigneeName": assignee_name,
        "department": ticket.department or "",
        "createdAt": ticket.created_at.isoformat() if ticket.created_at else "",
        "updatedAt": ticket.updated_at.isoformat() if ticket.updated_at else "",
        "resolvedAt": None,
        "slaBreach": False,
        "slaDueDate": "",
        "resolutionRemark": ticket.resolution_remark,
        "satisfactionStatus": ticket.satisfaction_status,
        "comments": comments,
    }

async def _next_ticket_number(db: AsyncSession) -> str:
    result = await db.execute(select(func.count(Ticket.id)))
    count = result.scalar() or 0
    return f"TK-{1001 + count}"

def is_finance_category(category: str) -> bool:
    if not category:
        return False
    c = category.lower()
    return any(x in c for x in ["finance", "stipend", "salary", "reimbursement", "payment failure", "payment"])

def is_hr_category(category: str) -> bool:
    if not category:
        return False
    c = category.lower()
    return any(x in c for x in ["hr", "employee", "leave", "joining", "document", "onboarding", "compliance"])

# ---------- routes ----------

@router.get("/")
async def list_tickets(
    user_id: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    user_roles: list[str] = Depends(get_user_roles),
):
    """List tickets with row-level data restrictions based on the logged-in user's role."""
    # Base query
    query = select(Ticket).where(Ticket.deleted_at.is_(None))

    if "SUPER_ADMIN" not in user_roles:
        # Construct conditions list for non-admins
        conditions = [
            Ticket.requester_user_id == current_user.id,
            Ticket.assigned_user_id == current_user.id
        ]

        # 1. Mentor tickets
        if "MENTOR" in user_roles:
            mentor_stmt = select(MentorProfile).where(MentorProfile.user_id == current_user.id)
            mentor = (await db.execute(mentor_stmt)).scalars().first()
            if mentor:
                assign_stmt = select(MentorAssignment.student_profile_id).where(
                    MentorAssignment.mentor_profile_id == mentor.id,
                    MentorAssignment.status == "ACTIVE"
                )
                student_profile_ids = (await db.execute(assign_stmt)).scalars().all()
                if student_profile_ids:
                    stud_users_stmt = select(StudentProfile.user_id).where(StudentProfile.id.in_(student_profile_ids))
                    stud_user_ids = (await db.execute(stud_users_stmt)).scalars().all()
                    if stud_user_ids:
                        conditions.append(Ticket.requester_user_id.in_(stud_user_ids))

        # 2. College Coordinator tickets
        if "COLLEGE_COORDINATOR" in user_roles:
            coord_stmt = select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id)
            emp = (await db.execute(coord_stmt)).scalars().first()
            if emp and emp.department_id:
                # Students in coordinator's department
                dept_studs_stmt = select(StudentProfile.user_id).where(StudentProfile.department_id == emp.department_id)
                dept_stud_user_ids = (await db.execute(dept_studs_stmt)).scalars().all()
                if dept_stud_user_ids:
                    conditions.append(Ticket.requester_user_id.in_(dept_stud_user_ids))
                
                # Mentors in coordinator's department
                dept_mentors_stmt = select(MentorProfile.user_id).join(EmployeeProfile, EmployeeProfile.id == MentorProfile.employee_profile_id).where(EmployeeProfile.department_id == emp.department_id)
                dept_mentor_user_ids = (await db.execute(dept_mentors_stmt)).scalars().all()
                if dept_mentor_user_ids:
                    conditions.append(Ticket.requester_user_id.in_(dept_mentor_user_ids))

        # 3. HR tickets
        if "HR" in user_roles:
            hr_categories = ["hr", "leave", "joining", "documents", "employee profile", "onboarding", "compliance"]
            conditions.append(func.lower(Ticket.category).in_(hr_categories))

        # 4. Reporting Manager tickets
        if any(r in {"MANAGEMENT", "REPORTING_MANAGER"} for r in user_roles):
            emp_stmt = select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id)
            emp = (await db.execute(emp_stmt)).scalars().first()
            if emp and emp.department_id:
                dept_emp_stmt = select(EmployeeProfile.user_id).where(EmployeeProfile.department_id == emp.department_id)
                dept_emp_user_ids = (await db.execute(dept_emp_stmt)).scalars().all()
                if dept_emp_user_ids:
                    conditions.append(Ticket.requester_user_id.in_(dept_emp_user_ids))

        # 5. Finance Manager tickets
        if "FINANCE_MANAGER" in user_roles:
            fin_categories = ["finance", "stipend", "salary", "reimbursement", "payment failure", "payment"]
            conditions.append(func.lower(Ticket.category).in_(fin_categories))

        # Combine all conditions with OR
        query = query.where(or_(*conditions))

    # Apply additional user_id query parameter filter
    if user_id:
        try:
            uid = uuid.UUID(user_id)
            query = query.where((Ticket.requester_user_id == uid) | (Ticket.assigned_user_id == uid))
        except ValueError:
            pass

    query = query.order_by(desc(Ticket.updated_at))
    result = await db.execute(query)
    tickets = result.scalars().all()
    
    data = []
    for t in tickets:
        data.append(await _serialize_ticket(t, db))
    return success_response(data=data)


@router.get("/{ticket_id}")
async def get_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    user_roles: list[str] = Depends(get_user_roles),
):
    """Get a single ticket by ID after checking security restrictions."""
    try:
        tid = uuid.UUID(ticket_id)
    except ValueError:
        return success_response(data=None, message="Invalid ticket ID")

    ticket = await db.get(Ticket, tid)
    if not ticket or ticket.deleted_at:
        return success_response(data=None, message="Ticket not found")

    # Access control check
    if "SUPER_ADMIN" not in user_roles:
        is_allowed = False
        if ticket.requester_user_id == current_user.id or ticket.assigned_user_id == current_user.id:
            is_allowed = True
        else:
            if "MENTOR" in user_roles:
                mentor_stmt = select(MentorProfile).where(MentorProfile.user_id == current_user.id)
                mentor = (await db.execute(mentor_stmt)).scalars().first()
                if mentor:
                    assign_stmt = select(MentorAssignment.student_profile_id).where(
                        MentorAssignment.mentor_profile_id == mentor.id,
                        MentorAssignment.status == "ACTIVE"
                    )
                    student_profile_ids = (await db.execute(assign_stmt)).scalars().all()
                    if student_profile_ids:
                        stud_users_stmt = select(StudentProfile.user_id).where(StudentProfile.id.in_(student_profile_ids))
                        stud_user_ids = (await db.execute(stud_users_stmt)).scalars().all()
                        if ticket.requester_user_id in stud_user_ids:
                            is_allowed = True

            if not is_allowed and "COLLEGE_COORDINATOR" in user_roles:
                coord_stmt = select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id)
                emp = (await db.execute(coord_stmt)).scalars().first()
                if emp and emp.department_id:
                    dept_studs_stmt = select(StudentProfile.user_id).where(StudentProfile.department_id == emp.department_id)
                    dept_stud_user_ids = (await db.execute(dept_studs_stmt)).scalars().all()
                    
                    dept_mentors_stmt = select(MentorProfile.user_id).join(EmployeeProfile, EmployeeProfile.id == MentorProfile.employee_profile_id).where(EmployeeProfile.department_id == emp.department_id)
                    dept_mentor_user_ids = (await db.execute(dept_mentors_stmt)).scalars().all()
                    
                    if ticket.requester_user_id in dept_stud_user_ids or ticket.requester_user_id in dept_mentor_user_ids:
                        is_allowed = True

            if not is_allowed and "HR" in user_roles:
                hr_categories = ["hr", "leave", "joining", "documents", "employee profile", "onboarding", "compliance"]
                if ticket.category and ticket.category.lower() in hr_categories:
                    is_allowed = True

            if not is_allowed and any(r in {"MANAGEMENT", "REPORTING_MANAGER"} for r in user_roles):
                emp_stmt = select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id)
                emp = (await db.execute(emp_stmt)).scalars().first()
                if emp and emp.department_id:
                    dept_emp_stmt = select(EmployeeProfile.user_id).where(EmployeeProfile.department_id == emp.department_id)
                    dept_emp_user_ids = (await db.execute(dept_emp_stmt)).scalars().all()
                    if ticket.requester_user_id in dept_emp_user_ids:
                        is_allowed = True

            if not is_allowed and "FINANCE_MANAGER" in user_roles:
                fin_categories = ["finance", "stipend", "salary", "reimbursement", "payment failure", "payment"]
                if ticket.category and ticket.category.lower() in fin_categories:
                    is_allowed = True

        if not is_allowed:
            raise HTTPException(status_code=403, detail="Permission denied to view this ticket")

    data = await _serialize_ticket(ticket, db)
    return success_response(data=data)


@router.post("/")
async def create_ticket(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    user_roles: list[str] = Depends(get_user_roles)
):
    """Create a new ticket and automatically assign it to the immediate hierarchy level."""
    body = await request.json()
    ticket_number = await _next_ticket_number(db)

    # Determine assignee based on hierarchy rules
    assigned_user_id = None
    status = "Open"
    category = body.get("category", "General")

    # 1. Students -> auto-assign to Mentor
    if "STUDENT" in user_roles:
        stud_stmt = select(StudentProfile).where(StudentProfile.user_id == current_user.id)
        stud = (await db.execute(stud_stmt)).scalars().first()
        if stud:
            assign_stmt = select(MentorProfile.user_id).join(MentorAssignment, MentorAssignment.mentor_profile_id == MentorProfile.id).where(
                MentorAssignment.student_profile_id == stud.id,
                MentorAssignment.status == "ACTIVE"
            )
            mentor_uid = (await db.execute(assign_stmt)).scalar()
            if mentor_uid:
                assigned_user_id = mentor_uid
                status = "Assigned"

    # 2. Mentors -> auto-assign to College Coordinator
    elif "MENTOR" in user_roles:
        mentor_stmt = select(MentorProfile).where(MentorProfile.user_id == current_user.id)
        mentor = (await db.execute(mentor_stmt)).scalars().first()
        if mentor and mentor.employee_profile_id:
            emp_stmt = select(EmployeeProfile).where(EmployeeProfile.id == mentor.employee_profile_id)
            emp = (await db.execute(emp_stmt)).scalars().first()
            if emp and emp.department_id:
                coord_stmt = select(DepartmentCoordinatorProfile.user_id).where(DepartmentCoordinatorProfile.department_id == emp.department_id)
                coord_uid = (await db.execute(coord_stmt)).scalar()
                if coord_uid:
                    assigned_user_id = coord_uid
                    status = "Assigned"

    # 3. Categorized auto-routing for other roles
    if not assigned_user_id:
        if is_finance_category(category):
            # Route to Finance Manager
            fm_stmt = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "FINANCE_MANAGER")
            assigned_user_id = (await db.execute(fm_stmt)).scalar()
            if assigned_user_id:
                status = "Assigned"
        elif is_hr_category(category):
            # Route to HR
            hr_stmt = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "HR")
            assigned_user_id = (await db.execute(hr_stmt)).scalar()
            if assigned_user_id:
                status = "Assigned"

    ticket = Ticket(
        requester_user_id=current_user.id,
        ticket_number=ticket_number,
        subject=body.get("title") or body.get("subject", "No Subject"),
        description=body.get("description", ""),
        category=category,
        priority=body.get("priority", "Medium"),
        status=status,
        assigned_user_id=assigned_user_id,
        department=body.get("department", ""),
        version_id=1,
    )
    db.add(ticket)
    await db.flush()

    data = await _serialize_ticket(ticket, db)
    return success_response(data=data, message="Ticket created successfully")


@router.patch("/{ticket_id}")
async def update_ticket(
    ticket_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    user_roles: list[str] = Depends(get_user_roles)
):
    """Update ticket properties or perform resolution/escalation workflow routing."""
    try:
        tid = uuid.UUID(ticket_id)
    except ValueError:
        return success_response(data=None, message="Invalid ticket ID")

    ticket = await db.get(Ticket, tid)
    if not ticket or ticket.deleted_at:
        return success_response(data=None, message="Ticket not found")

    body = await request.json()

    # Requester satisfaction updates
    if "satisfactionStatus" in body:
        if ticket.requester_user_id != current_user.id and "SUPER_ADMIN" not in user_roles:
            raise HTTPException(status_code=403, detail="Only the ticket creator can update satisfaction rating.")
        
        sat = body["satisfactionStatus"]
        ticket.satisfaction_status = sat
        if sat == "satisfied":
            ticket.status = "Closed"
        elif sat == "not_satisfied":
            ticket.status = "Open"
            ticket.assigned_user_id = None
        ticket.version_id = (ticket.version_id or 1) + 1
        await db.flush()
        return success_response(data=await _serialize_ticket(ticket, db))

    # Resolve/Escalate workflow
    if "resolveAction" in body:
        # Security: only current assignee or Super Admin can resolve/escalate
        if ticket.assigned_user_id != current_user.id and "SUPER_ADMIN" not in user_roles:
            raise HTTPException(status_code=403, detail="Only the currently assigned authority can resolve or escalate the ticket.")

        action = body["resolveAction"]
        if action == "yes":
            ticket.status = "Resolved"
            ticket.resolution_remark = body.get("remark", "")
        elif action == "no":
            # Escale upward based on hierarchy
            assignee_roles = await get_roles_by_user_id(db, ticket.assigned_user_id or current_user.id)
            next_assignee_id = None

            if "MENTOR" in assignee_roles:
                # Mentor -> College Coordinator
                stud_stmt = select(StudentProfile).where(StudentProfile.user_id == ticket.requester_user_id)
                stud = (await db.execute(stud_stmt)).scalars().first()
                if stud and stud.department_id:
                    coord_stmt = select(DepartmentCoordinatorProfile.user_id).where(DepartmentCoordinatorProfile.department_id == stud.department_id)
                    next_assignee_id = (await db.execute(coord_stmt)).scalar()
                
                if not next_assignee_id:
                    fallback = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "COLLEGE_COORDINATOR")
                    next_assignee_id = (await db.execute(fallback)).scalar()

            elif "COLLEGE_COORDINATOR" in assignee_roles:
                # Coordinator -> HR / Reporting Manager
                if is_finance_category(ticket.category):
                    fm = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "FINANCE_MANAGER")
                    next_assignee_id = (await db.execute(fm)).scalar()
                else:
                    hr = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "HR")
                    next_assignee_id = (await db.execute(hr)).scalar()

            elif any(r in {"HR", "MANAGEMENT", "REPORTING_MANAGER"} for r in assignee_roles):
                # HR / Manager -> Finance Manager (if Finance category) else Super Admin
                if is_finance_category(ticket.category):
                    fm = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "FINANCE_MANAGER")
                    next_assignee_id = (await db.execute(fm)).scalar()
                else:
                    sa = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "SUPER_ADMIN")
                    next_assignee_id = (await db.execute(sa)).scalar()

            elif "FINANCE_MANAGER" in assignee_roles:
                # Finance Manager -> Super Admin
                sa = select(User.id).join(UserRole, UserRole.role_id == Role.id).join(Role, UserRole.role_id == Role.id).where(Role.code == "SUPER_ADMIN")
                next_assignee_id = (await db.execute(sa)).scalar()

            ticket.status = "Escalated"
            ticket.assigned_user_id = next_assignee_id

        ticket.version_id = (ticket.version_id or 1) + 1
        await db.flush()
        return success_response(data=await _serialize_ticket(ticket, db))

    # Standard status / assignee update from management console (only Super Admin, HR, Managers)
    if "status" in body:
        ticket.status = body["status"]
    if "assigneeId" in body:
        assignee_id = body["assigneeId"]
        if assignee_id:
            try:
                ticket.assigned_user_id = uuid.UUID(assignee_id)
            except ValueError:
                pass
        else:
            ticket.assigned_user_id = None

    ticket.version_id = (ticket.version_id or 1) + 1
    await db.flush()
    data = await _serialize_ticket(ticket, db)
    return success_response(data=data, message="Ticket updated successfully")


@router.post("/{ticket_id}/messages")
async def add_message(
    ticket_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a reply or comment to a ticket."""
    try:
        tid = uuid.UUID(ticket_id)
    except ValueError:
        return success_response(data=None, message="Invalid ticket ID")

    ticket = await db.get(Ticket, tid)
    if not ticket or ticket.deleted_at:
        return success_response(data=None, message="Ticket not found")

    body = await request.json()

    msg = TicketMessage(
        ticket_id=tid,
        sender_user_id=current_user.id,
        message=body.get("content") or body.get("message", ""),
        version_id=1,
    )
    db.add(msg)
    await db.flush()

    ticket.version_id = (ticket.version_id or 1) + 1
    await db.flush()

    comment_data = {
        "id": str(msg.id),
        "ticketId": str(tid),
        "authorId": str(current_user.id),
        "authorName": current_user.username,
        "content": msg.message,
        "timestamp": msg.created_at.isoformat() if msg.created_at else "",
        "isInternal": False,
    }
    return success_response(data=comment_data, message="Message added successfully")
