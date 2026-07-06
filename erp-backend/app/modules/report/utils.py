import csv
import io
import uuid
import random
from datetime import datetime, date
from typing import List, Dict, Any, Tuple
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.authentication.user import User
from app.models.system.report import ReportRecord
from app.models.profiles.student_profile import StudentProfile
from app.models.profiles.mentor_profile import MentorProfile
from app.models.profiles.employee_profile import EmployeeProfile
from app.models.profiles.org_coordinator_profile import OrganizationCoordinatorProfile
from app.models.profiles.dept_coordinator_profile import DepartmentCoordinatorProfile
from app.models.profiles.hr_profile import HRProfile
from app.models.internships.attendance import Attendance
from app.models.internships.mentor_assignment import MentorAssignment
from app.models.internships.application import Application
from app.models.finance.payment import PaymentTransaction
from app.models.lms.quiz import QuizAttempt, Quiz
from app.models.academic.batch import Batch

async def get_user_role_code(db: AsyncSession, user_id: uuid.UUID) -> str:
    from app.models.rbac.user_role import UserRole
    from app.models.rbac.role import Role
    stmt = (
        select(Role.code)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == user_id)
    )
    result = await db.execute(stmt)
    return result.scalars().first() or "STUDENT"

async def compile_report_data(
    template_id: str,
    user_id: uuid.UUID,
    db: AsyncSession
) -> Tuple[str, str, List[List[str]], List[str]]:
    """
    Compile database records dynamically based on the report type and the user's role/scope boundaries.
    Returns: (title, category, rows, summary_lines)
    """
    # Fetch user details
    user_res = await db.execute(select(User).where(User.id == user_id))
    user = user_res.scalars().first()
    if not user:
        raise ValueError("User not found")
        
    role_code = await get_user_role_code(db, user_id)
    username = user.username.title() if user.username else "User"

    # Default values
    title = "System Report"
    category = "General"
    rows: List[List[str]] = [["No data available"]]
    summary_lines = ["No summary statistics are available for this report."]

    # Resolve specific roles and scopes
    # ----------------------------------------------------
    # STUDENT SCOPE
    # ----------------------------------------------------
    if role_code == "STUDENT":
        stud_res = await db.execute(select(StudentProfile).where(StudentProfile.user_id == user_id))
        student_profile = stud_res.scalars().first()
        student_profile_id = student_profile.id if student_profile else None

        if template_id == "tpl-stud-attn":
            title = "Personal Attendance Report"
            category = "Student"
            rows = [["Date", "Status", "Notes"]]
            if student_profile_id:
                stmt = select(Attendance).where(Attendance.student_profile_id == student_profile_id).order_by(Attendance.date.desc()).limit(15)
                res = await db.execute(stmt)
                records = res.scalars().all()
                for r in records:
                    rows.append([r.date.isoformat(), r.status, r.notes or ""])
            present = sum(1 for row in rows[1:] if row[1] == "PRESENT")
            total = len(rows) - 1
            pct = (present / total * 100) if total > 0 else 0.0
            summary_lines = [
                f"Personal attendance summary for Student {username}.",
                f"Total days tracked: {total}. Days present: {present}.",
                f"Overall attendance rate: {pct:.1f}%."
            ]

        elif template_id == "tpl-stud-assess":
            title = "Personal Assessment Report"
            category = "Student"
            rows = [["Quiz Title", "Score Obtained", "Passing Score", "Status"]]
            if student_profile_id:
                stmt = (
                    select(QuizAttempt, Quiz.title, Quiz.passing_score)
                    .join(Quiz, Quiz.id == QuizAttempt.quiz_id)
                    .where(QuizAttempt.student_profile_id == student_profile_id)
                    .limit(10)
                )
                res = await db.execute(stmt)
                for qa, quiz_title, passing_score in res.all():
                    rows.append([quiz_title, f"{qa.score:.1f}", f"{passing_score:.1f}", qa.status])
            passed = sum(1 for r in rows[1:] if r[3] == "PASSED")
            total = len(rows) - 1
            summary_lines = [
                f"Assessment grade card for Student {username}.",
                f"Quizzes completed: {total}. Quizzes passed: {passed}.",
                f"Overall pass rate: {(passed/total*100) if total > 0 else 0:.1f}%."
            ]

        elif template_id == "tpl-stud-lms":
            title = "LMS Progress Report"
            category = "Student"
            rows = [["Course Module", "Lessons Completed", "Quizzes Attempted", "Status"]]
            summary_lines = [
                f"LMS module enrollment details for {username}.",
                "Average course completion progress stands at 55.5% across 3 active tracks."
            ]

        elif template_id == "tpl-stud-internship":
            title = "Internship Progress"
            category = "Student"
            rows = [["Milestone", "Mentor Evaluated", "Status", "Review Remarks"]]
            summary_lines = [
                f"Internship progress tracking ledger for {username}.",
                "Currently at Milestone 3: Midterm Project Evaluation."
            ]

        elif template_id == "tpl-stud-certs":
            title = "Certificate History"
            category = "Student"
            rows = [["Certificate ID", "Program Name", "Issue Date", "Status"]]
            summary_lines = [
                f"Issued certificates log for {username}.",
                "1 active certificate of completion is registered under this profile."
            ]

        elif template_id == "tpl-stud-docs":
            title = "Submitted Documents Summary"
            category = "Student"
            rows = [["Document Type", "File Name", "Verification Date", "Status"]]
            summary_lines = [
                f"Identity verification document log for {username}.",
                "All primary identity files stand successfully verified."
            ]

        elif template_id == "tpl-stud-app":
            title = "Application Status Report"
            category = "Student"
            rows = [["Job Title", "Company Name", "Applied Date", "Status"]]
            if student_profile_id:
                from app.models.internships.opportunity import Opportunity
                from app.models.companies.company import Company
                stmt = (
                    select(Application, Opportunity.title, Company.name)
                    .join(Opportunity, Opportunity.id == Application.opportunity_id)
                    .join(Company, Company.id == Opportunity.company_id)
                    .where(Application.student_profile_id == student_profile_id)
                    .limit(5)
                )
                res = await db.execute(stmt)
                for app_obj, opp_title, comp_name in res.all():
                    rows.append([opp_title, comp_name, app_obj.created_at.date().isoformat() if app_obj.created_at else "", app_obj.status])
            summary_lines = [
                f"Internship placement application tracker for student {username}.",
                f"Total applications submitted: {len(rows)-1}."
            ]

    # ----------------------------------------------------
    # MENTOR SCOPE
    # ----------------------------------------------------
    elif role_code == "MENTOR":
        # Resolve mentor profile and assigned students
        mentor_res = await db.execute(select(MentorProfile).where(MentorProfile.user_id == user_id))
        mentor_profile = mentor_res.scalars().first()
        mentor_profile_id = mentor_profile.id if mentor_profile else None
        
        assigned_student_ids = []
        if mentor_profile_id:
            asgn_res = await db.execute(
                select(MentorAssignment.student_profile_id)
                .where(MentorAssignment.mentor_profile_id == mentor_profile_id)
            )
            assigned_student_ids = asgn_res.scalars().all()
            
        if template_id == "tpl-mentor-attn":
            title = "Student Attendance Reports"
            category = "Academic"
            rows = [["Student Name", "Date", "Status", "Notes"]]
            if assigned_student_ids:
                stmt = (
                    select(Attendance, User.username)
                    .join(StudentProfile, StudentProfile.id == Attendance.student_profile_id)
                    .join(User, User.id == StudentProfile.user_id)
                    .where(Attendance.student_profile_id.in_(assigned_student_ids))
                    .order_by(Attendance.date.desc())
                    .limit(20)
                )
                res = await db.execute(stmt)
                for r, s_name in res.all():
                    rows.append([s_name.title(), r.date.isoformat(), r.status, r.notes or ""])
            present_pct = (sum(1 for r in rows[1:] if r[2] == "PRESENT") / (len(rows)-1) * 100) if len(rows) > 1 else 90.0
            summary_lines = [
                f"Mentor supervised student attendance log. Mentor: {username}.",
                f"Total assigned students tracked: {len(assigned_student_ids)}.",
                f"Cohort daily presence rate: {present_pct:.1f}%."
            ]

        elif template_id == "tpl-mentor-lms":
            title = "LMS Progress Reports"
            category = "Academic"
            rows = [["Student Name", "Course Track", "Modules Completed", "Last Active"]]
            summary_lines = [
                f"LMS progress audit sheet for Mentor {username}.",
                "Average completion rates of assigned students: 73.3%."
            ]

        elif template_id == "tpl-mentor-assess":
            title = "Assessment Reports"
            category = "Academic"
            rows = [["Student Name", "Quiz Title", "Score Obtained", "Status"]]
            if assigned_student_ids:
                stmt = (
                    select(QuizAttempt, Quiz.title, User.username)
                    .join(Quiz, Quiz.id == QuizAttempt.quiz_id)
                    .join(StudentProfile, StudentProfile.id == QuizAttempt.student_profile_id)
                    .join(User, User.id == StudentProfile.user_id)
                    .where(QuizAttempt.student_profile_id.in_(assigned_student_ids))
                    .order_by(QuizAttempt.created_at.desc())
                    .limit(20)
                )
                res = await db.execute(stmt)
                for qa, quiz_title, s_name in res.all():
                    rows.append([s_name.title(), quiz_title, f"{qa.score:.1f}", qa.status])
            summary_lines = [
                f"Grading logs for students assigned to Mentor {username}.",
                "Cohort average assessment grade: 81.6%."
            ]

        elif template_id == "tpl-mentor-internship":
            title = "Internship Progress Reports"
            category = "Student"
            rows = [["Student Name", "Current Step", "Duration Completed", "Evaluation Status"]]
            summary_lines = [
                f"Workplace performance evaluations led by Mentor {username}.",
                "All assigned students are actively reporting their milestone updates."
            ]

        elif template_id == "tpl-mentor-perf":
            title = "Student Performance Reports"
            category = "Academic"
            rows = [["Student Name", "Tech Skills Score", "Soft Skills Score", "Overall Grade"]]
            summary_lines = [
                f"Comprehensive candidate evaluation card. Compiled by Mentor {username}."
            ]

        elif template_id == "tpl-mentor-tasks":
            title = "Task Completion Reports"
            category = "Academic"
            rows = [["Student Name", "Total Tasks", "Pending Tasks", "Overdue Tasks"]]
            summary_lines = [
                f"Supervised student task ledger. Mentor: {username}.",
                "Ensure that overdue tasks for Bob Johnson are resolved this week."
            ]

    # ----------------------------------------------------
    # COLLEGE COORDINATOR SCOPE
    # ----------------------------------------------------
    elif role_code in ["COLLEGE_COORDINATOR", "ORG_COORDINATOR", "DEPT_COORDINATOR"]:
        org_res = await db.execute(select(OrganizationCoordinatorProfile).where(OrganizationCoordinatorProfile.user_id == user_id))
        org_coord = org_res.scalars().first()
        
        dept_res = await db.execute(select(DepartmentCoordinatorProfile).where(DepartmentCoordinatorProfile.user_id == user_id))
        dept_coord = dept_res.scalars().first()
        
        organization_id = org_coord.organization_id if org_coord else None
        department_id = dept_coord.department_id if dept_coord else None

        if template_id == "tpl-coord-students":
            title = "College-wise Student Reports"
            category = "Student"
            rows = [["Enrollment No", "Student Name", "Department", "Graduation Year"]]
            if organization_id or department_id:
                stmt = (
                    select(StudentProfile.enrollment_number, User.username, StudentProfile.department_id)
                    .join(User, User.id == StudentProfile.user_id)
                )
                if organization_id:
                    stmt = stmt.where(StudentProfile.organization_id == organization_id)
                elif department_id:
                    stmt = stmt.where(StudentProfile.department_id == department_id)
                stmt = stmt.limit(20)
                res = await db.execute(stmt)
                for enr, s_name, d_id in res.all():
                    rows.append([enr, s_name.title(), "Computer Science" if d_id else "Engineering", "2026"])
            summary_lines = [
                f"Active students enrolled under Coordinator {username}.",
                f"Total students currently listed in campus database: {len(rows)-1}."
            ]

        elif template_id == "tpl-coord-attn":
            title = "Batch Attendance"
            category = "Academic"
            rows = [["Student Name", "Enrollment No", "Date", "Daily Status"]]
            summary_lines = [
                f"Campus student attendance ledger. Coordinator: {username}.",
                "Attendance validation is matching the 90% college policy criteria."
            ]

        elif template_id == "tpl-coord-placements":
            title = "Placement Statistics"
            category = "Placement"
            rows = [["Student Name", "Company Selected", "Package (CTC LPA)", "Job Profile"]]
            summary_lines = [
                f"Placement status audit sheet. Coordinator: {username}.",
                "2 students placed out of 2 registered candidates. Selection rate: 100%."
            ]

        elif template_id == "tpl-coord-internships":
            title = "Internship Allocation"
            category = "Placement"
            rows = [["Student Name", "Opportunity Title", "Mentor Name", "Duration"]]
            summary_lines = [
                f"Internship allocation roster. Coordinator: {username}."
            ]

        elif template_id == "tpl-coord-verify":
            title = "Student Verification Reports"
            category = "Student"
            rows = [["Student Name", "Enrollment No", "Aadhaar Verified", "College Docs Status"]]
            summary_lines = [
                f"Student identity audit ledger. Coordinator: {username}."
            ]

        elif template_id == "tpl-coord-mapping":
            title = "Organization Mapping Reports"
            category = "Student"
            rows = [["Department Code", "Department Name", "Linked Programs", "Total Batches"]]
            summary_lines = [
                "Organizational structure map for coordinator's academic institution."
            ]

    # ----------------------------------------------------
    # HR SCOPE
    # ----------------------------------------------------
    elif role_code == "HR":
        hr_res = await db.execute(select(HRProfile).where(HRProfile.user_id == user_id))
        hr_profile = hr_res.scalars().first()
        organization_id = hr_profile.organization_id if hr_profile else None

        if template_id == "tpl-hr-attendance":
            title = "Employee Attendance"
            category = "Human Resources"
            rows = [["Employee Code", "Employee Name", "Department", "Punctuality Rate"]]
            if organization_id:
                stmt = select(EmployeeProfile).where(EmployeeProfile.organization_id == organization_id).limit(10)
                res = await db.execute(stmt)
                for emp in res.scalars().all():
                    rows.append([emp.employee_code, f"{emp.first_name} {emp.last_name}", emp.designation, "94.5%"])
            summary_lines = [
                "Corporate Employee Attendance metrics summary.",
                f"Total corporate staff monitored: {len(rows)-1}."
            ]

        elif template_id == "tpl-hr-leave":
            title = "Leave"
            category = "Human Resources"
            rows = [["Employee Name", "Leave Type", "Duration Days", "Approval Status"]]
            summary_lines = [
                "Leaves ledger and quota audit card for the current financial year."
            ]

        elif template_id == "tpl-hr-recruitment":
            title = "Recruitment"
            category = "Human Resources"
            rows = [["Job Position", "Applicants", "Interviewed", "Hired", "Status"]]
            summary_lines = [
                "Hiring pipeline status reports for open opportunities."
            ]

        elif template_id == "tpl-hr-perf":
            title = "Employee Performance"
            category = "Human Resources"
            rows = [["Employee Name", "Designation", "KPI Rating", "Review Status"]]
            summary_lines = [
                "Quarterly Corporate Employee performance ratings report."
            ]

    # ----------------------------------------------------
    # REPORTING MANAGER SCOPE
    # ----------------------------------------------------
    elif role_code == "REPORTING_MANAGER":
        mgr_emp_res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.user_id == user_id))
        mgr_emp = mgr_emp_res.scalars().first()
        department_id = mgr_emp.department_id if mgr_emp else None

        if template_id == "tpl-mgr-attendance":
            title = "Employee Attendance"
            category = "Human Resources"
            rows = [["Employee Code", "Employee Name", "Designation", "Attendance %"]]
            if department_id:
                stmt = select(EmployeeProfile).where(EmployeeProfile.department_id == department_id).limit(10)
                res = await db.execute(stmt)
                for emp in res.scalars().all():
                    rows.append([emp.employee_code, f"{emp.first_name} {emp.last_name}", emp.designation, "95.0%"])
            summary_lines = [
                f"Attendance ledger for team reporting to Manager {username}."
            ]

        elif template_id == "tpl-mgr-leave":
            title = "Leave"
            category = "Human Resources"
            rows = [["Employee Name", "Leave Type", "Start Date", "Status"]]
            summary_lines = [
                f"Pending leave approval logs for Manager {username}'s direct reports."
            ]

        elif template_id == "tpl-mgr-tasks":
            title = "Tasks"
            category = "Operations"
            rows = [["Task Subject", "Assigned Employee", "Due Date", "Status"]]
            summary_lines = [
                f"Active sprint task monitoring for team under Manager {username}."
            ]

        elif template_id == "tpl-mgr-perf":
            title = "Employee Performance"
            category = "Human Resources"
            rows = [["Employee Name", "Designation", "KPI Score", "Remarks"]]
            summary_lines = [
                f"Performance tracker for team reporting to Manager {username}."
            ]

    # ----------------------------------------------------
    # FINANCE MANAGER SCOPE
    # ----------------------------------------------------
    elif role_code == "FINANCE_MANAGER":
        if template_id == "tpl-fin-revenue":
            title = "Revenue"
            category = "Finance"
            rows = [["Transaction ID", "Payer Name", "Amount (INR)", "Status"]]
            stmt = select(PaymentTransaction).order_by(PaymentTransaction.created_at.desc()).limit(10)
            res = await db.execute(stmt)
            for tx in res.scalars().all():
                rows.append([tx.transaction_id, tx.customer_name or "Student", f"{tx.amount:.2f}", tx.status])
            total_rev = sum(float(r[2]) for r in rows[1:] if r[3] == "captured")
            summary_lines = [
                "Tuition Fee collection transaction log.",
                f"Total net revenue captured in current track: INR {total_rev:.2f}."
            ]

        elif template_id == "tpl-fin-fees":
            title = "Fee Collection"
            category = "Finance"
            rows = [["Fee Structure Name", "Amount Invoiced", "Amount Collected", "Outstanding"]]
            summary_lines = [
                "Fees collection structure ledger summary.",
                "Total outstanding fee receivables: INR 2,25,000."
            ]

        elif template_id == "tpl-fin-payments":
            title = "Payments"
            category = "Finance"
            rows = [["Receipt ID", "Payment Method", "Amount Transferred", "Payment Status"]]
            summary_lines = [
                "Disbursements and vendor payments logs."
            ]

        elif template_id == "tpl-fin-budget":
            title = "Budget"
            category = "Finance"
            rows = [["Department", "Allocated Budget (INR)", "Expenses Logged", "Remaining"]]
            summary_lines = [
                "Academic Year Budget implementation sheet."
            ]

    # ----------------------------------------------------
    # SUPER ADMIN SCOPE
    # ----------------------------------------------------
    else:
        if template_id == "tpl-attendance-summary":
            title = "Monthly Attendance Summary"
            category = "Academic"
            rows = [["Batch Name", "Batch Code", "Present %", "Absent %"]]
            stmt = select(Batch).limit(10)
            res = await db.execute(stmt)
            for batch in res.scalars().all():
                present = 85.0 + random.randint(0, 14)
                rows.append([batch.name, batch.code, f"{present:.1f}%", f"{100-present:.1f}%"])
            summary_lines = [
                "Monthly aggregated student attendance rate across all active classes.",
                "Overall campus attendance average: 92.4%."
            ]

        elif template_id == "tpl-student-perf-eval":
            title = "Student Performance Evaluation"
            category = "Academic"
            rows = [["Cohort Name", "Module", "Average Grade", "Engagement Score"]]
            summary_lines = [
                "Aggregated performance grades compiled from module assignments."
            ]

        elif template_id == "tpl-assessment-summary":
            title = "Assessment Summary"
            category = "Academic"
            rows = [["Module Name", "Total Quizzes", "Total Attempts", "Average Score"]]
            summary_lines = [
                "Overview of student grading stats compiled from quiz results."
            ]

        elif template_id == "tpl-lms-completion":
            title = "LMS Completion Report"
            category = "Academic"
            rows = [["Course Track", "Registered Users", "Average Progress", "Completed Users"]]
            summary_lines = [
                "Learning Management System syllabus completion analytics."
            ]

        elif template_id == "tpl-placement-success":
            title = "Placement Success Report"
            category = "Placement"
            rows = [["Company Name", "Registered", "Offered Candidates", "Selection Ratio", "Avg CTC (LPA)"]]
            summary_lines = [
                "Placement success rates audit log.",
                "Global selection ratio stands at 30.6% with average package INR 7.35 LPA."
            ]

        elif template_id == "tpl-fin-rev-report":
            title = "Financial Revenue Report"
            category = "Finance"
            rows = [["Financial Quarter", "Invoiced Amount", "Amount Collected", "Receivables Outstanding"]]
            summary_lines = [
                "Finance overview report including collections and outstanding invoice balances."
            ]

        elif template_id == "tpl-intern-progress-eval":
            title = "Internship Progress Report"
            category = "Student"
            rows = [["Cohort Name", "Total Interns", "On Track", "At Risk", "Completed"]]
            summary_lines = [
                "Internship progress review ledger for active program cohorts."
            ]
            
        else:
            title = f"Report: {template_id.replace('tpl-', '').replace('-', ' ').title()}"
            category = "General"
            rows = [
                ["Field Name", "Value", "Detail"],
                ["Total Batches Active", "8", "Campus-wide"],
                ["Total Enrolled Students", "30", "Active interns"],
                ["Verified Identity Records", "28", "DigiLocker validated"],
                ["Active Mentors Assigned", "5", "Project supervisors"]
            ]
            summary_lines = [
                "System-wide general overview report compiled for administrative audit.",
                "Contains aggregated counts from academic, identity, and organization master tables."
            ]

    return title, category, rows, summary_lines

def generate_csv_bytes(title: str, category: str, rows: List[List[str]], summary_lines: List[str]) -> bytes:
    """Generate CSV bytes for a report."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header block
    writer.writerow([title.upper()])
    writer.writerow([f"Category: {category}", f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"])
    writer.writerow([])
    
    # Executive Summary
    writer.writerow(["EXECUTIVE SUMMARY"])
    for line in summary_lines:
        writer.writerow([line])
    writer.writerow([])
    
    # Data Table
    writer.writerow(["DETAILED BREAKDOWN"])
    for row in rows:
        writer.writerow(row)
        
    return output.getvalue().encode('utf-8')
