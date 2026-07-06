import re

with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/modules/mentor/router.py', 'r') as f:
    content = f.read()

# Update get_mentors
new_get_mentors = """@router.get("", response_model=APIResponse[list[MentorProfileResponse]])
async def get_mentors(
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentors = await service.get_multi(current_user=current_user)
    
    # Fetch employee names
    emp_ids = [m.employee_profile_id for m in mentors if m.employee_profile_id]
    emp_map = {}
    if emp_ids:
        res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id.in_(emp_ids)))
        emps = res.scalars().all()
        emp_map = {e.id: f"{e.first_name} {e.last_name}" for e in emps}

    # Fetch user names for fallback
    user_ids = [m.user_id for m in mentors if m.employee_profile_id not in emp_map]
    user_map = {}
    if user_ids:
        res = await db.execute(select(User).where(User.id.in_(user_ids)))
        users = res.scalars().all()
        user_map = {u.id: u.username for u in users}

    return success_response(
        data=[map_response(m, emp_map.get(m.employee_profile_id) or user_map.get(m.user_id) or "Unknown Mentor") for m in mentors]
    )"""

content = re.sub(r'@router\.get\("", response_model=APIResponse\[list\[MentorProfileResponse\]\]\).*?for m in mentors\]\n    \)', new_get_mentors, content, flags=re.DOTALL)


# Update get_mentor, create_mentor, update_mentor to fetch name
helpers = """async def get_emp_or_user_name(db, mentor):
    if mentor.employee_profile_id:
        res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id == mentor.employee_profile_id))
        emp = res.scalars().first()
        if emp:
            return f"{emp.first_name} {emp.last_name}"
    res = await db.execute(select(User).where(User.id == mentor.user_id))
    user = res.scalars().first()
    if user:
        return user.username
    return "Unknown Mentor"

@router.get("/{mentor_id}", response_model=APIResponse[MentorProfileResponse])"""

content = re.sub(r'@router\.get\("/\{mentor_id\}", response_model=APIResponse\[MentorProfileResponse\]\)', helpers, content, flags=re.DOTALL)


new_get_mentor = """async def get_mentor(
    mentor_id: UUID,
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentor = await service.get(mentor_id)
    emp_name = await get_emp_or_user_name(db, mentor)

    return success_response(
        data=map_response(mentor, emp_name)
    )"""

content = re.sub(r'async def get_mentor\(.*?map_response\(mentor, emp_name\)\n    \)', new_get_mentor, content, flags=re.DOTALL)


new_create = """async def create_mentor(
    payload: MentorProfileCreate,
    current_user: User = Depends(require_permission("mentor", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentor = await service.create(obj_in=payload, user_id=current_user.id)
    emp_name = await get_emp_or_user_name(db, mentor)

    return success_response(
        data=map_response(mentor, emp_name),
        message="Mentor profile created successfully",
    )"""

content = re.sub(r'async def create_mentor\(.*?message="Mentor profile created successfully",\n    \)', new_create, content, flags=re.DOTALL)


new_update = """async def update_mentor(
    mentor_id: UUID,
    payload: MentorProfileUpdate,
    current_user: User = Depends(require_permission("mentor", "update")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentor = await service.update(id=mentor_id, obj_in=payload, user_id=current_user.id)
    emp_name = await get_emp_or_user_name(db, mentor)

    return success_response(
        data=map_response(mentor, emp_name),
        message="Mentor profile updated successfully",
    )"""

content = re.sub(r'async def update_mentor\(.*?message="Mentor profile updated successfully",\n    \)', new_update, content, flags=re.DOTALL)

with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/modules/mentor/router.py', 'w') as f:
    f.write(content)

print("Done")
