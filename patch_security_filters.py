import re

with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/core/security_filters.py', 'r') as f:
    content = f.read()

# Replace COLLEGE_COORDINATOR block in apply_student_filter
old_student_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        
        if org_id:
            return query.where(student_profile_model.organization_id == org_id)
        return query.where(student_profile_model.id == None)"""

new_student_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.organizations.tndce_college import TNDCECollege
        from app.models.organizations.organization import Organization
        
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        
        allocated_colleges = await get_allocated_target_ids(db, user.id, "COLLEGE")
        org_ids = []
        if org_id:
            org_ids.append(org_id)
            
        if allocated_colleges:
            stmt = select(Organization.id).join(
                TNDCECollege, TNDCECollege.college_code == Organization.code
            ).where(TNDCECollege.id.in_(allocated_colleges))
            res = await db.execute(stmt)
            mapped_org_ids = res.scalars().all()
            org_ids.extend(mapped_org_ids)
            
        if org_ids:
            return query.where(student_profile_model.organization_id.in_(org_ids))
        return query.where(student_profile_model.id == None)"""

content = content.replace(old_student_filter, new_student_filter)

# Replace COLLEGE_COORDINATOR block in apply_program_filter
old_program_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        if org_id:
            stmt = select(Batch.program_id).join(StudentProfile, StudentProfile.batch_id == Batch.id).where(
                StudentProfile.organization_id == org_id
            )
            result = await db.execute(stmt)
            program_ids = result.scalars().all()
            if program_ids:
                return query.where(program_model.id.in_(program_ids))
        return query.where(program_model.id.in_([]))"""

new_program_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        from app.models.organizations.tndce_college import TNDCECollege
        from app.models.organizations.organization import Organization
        
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        
        allocated_colleges = await get_allocated_target_ids(db, user.id, "COLLEGE")
        org_ids = []
        if org_id:
            org_ids.append(org_id)
            
        if allocated_colleges:
            stmt = select(Organization.id).join(
                TNDCECollege, TNDCECollege.college_code == Organization.code
            ).where(TNDCECollege.id.in_(allocated_colleges))
            res = await db.execute(stmt)
            mapped_org_ids = res.scalars().all()
            org_ids.extend(mapped_org_ids)
            
        if org_ids:
            stmt = select(Batch.program_id).join(StudentProfile, StudentProfile.batch_id == Batch.id).where(
                StudentProfile.organization_id.in_(org_ids)
            )
            result = await db.execute(stmt)
            program_ids = result.scalars().all()
            if program_ids:
                return query.where(program_model.id.in_(program_ids))
        return query.where(program_model.id.in_([]))"""

content = content.replace(old_program_filter, new_program_filter)

# Replace COLLEGE_COORDINATOR block in apply_batch_filter
old_batch_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        if org_id:
            # batches where at least one student from org_id is present
            stmt = select(StudentProfile.batch_id).where(
                and_(StudentProfile.organization_id == org_id, StudentProfile.batch_id != None)
            )
            result = await db.execute(stmt)
            batch_ids = result.scalars().all()
            if batch_ids:
                return query.where(batch_model.id.in_(batch_ids))
        return query.where(batch_model.id.in_([]))"""

new_batch_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        from app.models.organizations.tndce_college import TNDCECollege
        from app.models.organizations.organization import Organization
        
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        
        allocated_colleges = await get_allocated_target_ids(db, user.id, "COLLEGE")
        org_ids = []
        if org_id:
            org_ids.append(org_id)
            
        if allocated_colleges:
            stmt = select(Organization.id).join(
                TNDCECollege, TNDCECollege.college_code == Organization.code
            ).where(TNDCECollege.id.in_(allocated_colleges))
            res = await db.execute(stmt)
            mapped_org_ids = res.scalars().all()
            org_ids.extend(mapped_org_ids)
            
        if org_ids:
            # batches where at least one student from org_ids is present
            stmt = select(StudentProfile.batch_id).where(
                and_(StudentProfile.organization_id.in_(org_ids), StudentProfile.batch_id != None)
            )
            result = await db.execute(stmt)
            batch_ids = result.scalars().all()
            if batch_ids:
                return query.where(batch_model.id.in_(batch_ids))
        return query.where(batch_model.id.in_([]))"""

content = content.replace(old_batch_filter, new_batch_filter)

# Replace COLLEGE_COORDINATOR block in apply_program_scoped_filter
old_scoped_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        if org_id:
            # programs associated with batches where student is present
            stmt = select(Batch.program_id).join(StudentProfile, StudentProfile.batch_id == Batch.id).where(
                StudentProfile.organization_id == org_id
            )
            result = await db.execute(stmt)
            program_ids = result.scalars().all()
            if program_ids:
                return query.where(model_prog_id.in_(program_ids))
        return query.where(model.id.in_([]))"""

new_scoped_filter = """    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        from app.models.organizations.tndce_college import TNDCECollege
        from app.models.organizations.organization import Organization
        
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        
        allocated_colleges = await get_allocated_target_ids(db, user.id, "COLLEGE")
        org_ids = []
        if org_id:
            org_ids.append(org_id)
            
        if allocated_colleges:
            stmt = select(Organization.id).join(
                TNDCECollege, TNDCECollege.college_code == Organization.code
            ).where(TNDCECollege.id.in_(allocated_colleges))
            res = await db.execute(stmt)
            mapped_org_ids = res.scalars().all()
            org_ids.extend(mapped_org_ids)
            
        if org_ids:
            # programs associated with batches where student is present
            stmt = select(Batch.program_id).join(StudentProfile, StudentProfile.batch_id == Batch.id).where(
                StudentProfile.organization_id.in_(org_ids)
            )
            result = await db.execute(stmt)
            program_ids = result.scalars().all()
            if program_ids:
                return query.where(model_prog_id.in_(program_ids))
        return query.where(model.id.in_([]))"""

content = content.replace(old_scoped_filter, new_scoped_filter)

with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/core/security_filters.py', 'w') as f:
    f.write(content)

print("Done")
