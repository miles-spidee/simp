from __future__ import annotations

import random
import sys
import uuid
from pathlib import Path
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import Session, sessionmaker

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import app.models  # noqa: F401 - register every mapped model
from app.core.config import settings
from app.core.security import hash_password
from app.models.core.mixins import BaseModel as Base
from app.models.files.enums import FileStatusEnum, AccessLevelEnum


random.seed(42)
UTC = timezone.utc
NOW = datetime.now(timezone.utc)
import re
SYNC_DATABASE_URL = settings.DATABASE_URL.replace("+asyncpg", "+psycopg2")
SYNC_DATABASE_URL = re.sub(r"\?ssl=require", "", SYNC_DATABASE_URL)

engine = create_engine(SYNC_DATABASE_URL, connect_args={"sslmode": "require"}, future=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
MODEL_BY_TABLE = {mapper.local_table.name: mapper.class_ for mapper in Base.registry.mappers}

ROW_COUNTS = {
    "auth_devices": 8,
    "auth_login_history": 8,
    "auth_otps": 8,
    "auth_refresh_tokens": 8,
    "auth_sessions": 8,
    "auth_user_preferences": 20,
    "alum_career_progress": 10,
    "alum_interview_feedback": 10,
    "alum_interviews": 10,
    "alum_offer_letters": 5,
    "alum_placement_applications": 10,
    "alum_placement_drives": 3,
    "alum_profiles": 10,
    "analytics_data_points": 12,
    "analytics_dimensions": 6,
    "analytics_executive_metrics": 6,
    "analytics_export_jobs": 5,
    "analytics_risk_indicators": 5,
    "analytics_summaries": 1,
    "comm_announcement_audiences": 5,
    "comm_announcements": 5,
    "comm_conversation_participants": 10,
    "comm_conversations": 3,
    "comm_email_history": 10,
    "comm_messages": 20,
    "fin_fee_structures": 4,
    "fin_invoice_items": 20,
    "fin_invoices": 10,
    "fin_payment_transactions": 10,
    "fin_receipts": 10,
    "intern_applications": 30,
    "intern_assessments": 10,
    "intern_attendance": 900,
    "intern_certificates": 10,
    "intern_documents": 30,
    "intern_mentor_assignments": 5,
    "intern_opportunities": 6,
    "intern_opportunity_mentors": 6,
    "intern_tasks": 15,
    "lms_course_modules": 8,
    "lms_lessons": 16,
    "lms_quiz_attempts": 20,
    "lms_quizzes": 8,
    "sup_feedback_responses": 10,
    "sup_feedback_sessions": 2,
    "sup_ticket_messages": 20,
    "sup_tickets": 10,
    "sys_activity_logs": 20,
    "sys_generated_documents": 10,
    "sys_verification_records": 10,
}


def model(table_name: str):
    return MODEL_BY_TABLE[table_name]


def slug(value: str) -> str:
    return value.lower().replace(" ", "-").replace("_", "-")


def humanize(value: str) -> str:
    return value.replace("_", " ").title()


def pick(objects: list[Any], index: int = 0):
    if not objects:
        return None
    return objects[index % len(objects)]


def pick_id(state: dict[str, list[Any]], table_name: str, index: int = 0):
    item = pick(state.get(table_name, []), index)
    return None if item is None else item.id


def existing_rows(session: Session, table_name: str) -> list[Any]:
    table_model = model(table_name)
    return list(session.scalars(select(table_model).order_by(table_model.created_at)).all())


def seed_rows(session: Session, table_name: str, rows: list[dict[str, Any]], state: dict[str, list[Any]]):
    existing = existing_rows(session, table_name)
    if existing:
        if table_name == "auth_users" and len(existing) == 1:
            pass
        elif table_name == "rbac_user_roles" and len(existing) == 1:
            pass
        else:
            state[table_name] = existing
            return existing

    table_model = model(table_name)
    if table_name == "auth_users" and existing:
        existing_emails = {u.email for u in existing}
        existing_usernames = {u.username for u in existing}
        rows = [r for r in rows if r["email"] not in existing_emails and r["username"] not in existing_usernames]
    elif table_name == "rbac_user_roles" and existing:
        existing_pairs = {(r_obj.user_id, r_obj.role_id) for r_obj in existing}
        rows = [r for r in rows if (r["user_id"], r["role_id"]) not in existing_pairs]

    objects = [table_model(**row) for row in rows]
    session.add_all(objects)
    session.flush()
    
    combined = list(existing) + objects if existing else objects
    state[table_name] = combined
    return combined


def string_value(table_name: str, column_name: str, index: int) -> str:
    prefix = slug(table_name)
    if column_name in {"name", "title", "subject", "question"}:
        return f"{humanize(table_name)} {humanize(column_name)} {index + 1}"
    if column_name in {"description", "content", "content_html", "html_body", "message", "answer", "feedback", "comments", "mitigation"}:
        return f"Sample {humanize(table_name)} {index + 1} {humanize(column_name)}."
    if column_name in {"code", "username", "enrollment_number", "employee_code", "transaction_id", "receipt_number", "invoice_number", "certificate_number", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "receipt", "customer_name"}:
        return f"{prefix}-{column_name}-{index + 1:03d}"
    if column_name in {"email", "customer_email", "verifier_email", "recipient_email"}:
        return f"{prefix}.{index + 1}@example.com"
    if column_name in {"phone", "customer_contact"}:
        return f"+91-90000{index + 100:04d}"
    if column_name in {"website", "file_url", "logo_url", "profile_image_url", "front_design_url", "back_design_url", "video_url", "push_notification_token"}:
        return f"https://example.com/{prefix}/{index + 1}"
    if column_name == "ip_address":
        return f"10.0.{index // 255}.{index % 255}"
    if column_name == "user_agent":
        return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    if column_name == "browser":
        return ["Chrome", "Edge", "Firefox"][index % 3]
    if column_name == "operating_system":
        return ["Windows 11", "macOS", "Ubuntu"][index % 3]
    if column_name == "platform":
        return ["Web", "Mobile", "Desktop"][index % 3]
    if column_name == "category":
        return ["General", "Academic", "Technical", "Placement"][index % 4]
    if column_name == "theme":
        return ["system", "light", "dark"][index % 3]
    if column_name == "color":
        return ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5]
    if column_name == "purpose":
        return ["MFA", "EMAIL_VERIFY", "PASSWORD_RESET"][index % 3]
    if column_name == "result":
        return ["SUCCESS", "FAILURE"][index % 2]
    if column_name == "type":
        if table_name == "comm_conversations":
            return ["DIRECT", "GROUP"][index % 2]
        if table_name == "org_organizations":
            return ["Engineering", "Science", "Management"][index % 3]
        if table_name == "acad_programs":
            return ["Degree", "Certification", "Bootcamp"][index % 3]
        if table_name == "fin_fee_structures":
            return ["Tuition", "Exam", "Hostel", "Transport"][index % 4]
        return ["Primary", "Secondary", "Tertiary"][index % 3]
    if column_name == "priority":
        return ["LOW", "NORMAL", "HIGH", "URGENT"][index % 4]
    if column_name == "status":
        status_map = {
            "auth_users": "ACTIVE",
            "comm_announcements": "PUBLISHED",
            "comm_email_history": "DELIVERED",
            "comm_messages": "SENT",
            "analytics_export_jobs": "Completed",
            "alum_placement_applications": "APPLIED",
            "alum_placement_drives": "SCHEDULED",
            "alum_offer_letters": "ISSUED",
            "alum_interviews": "SCHEDULED",
            "analytics_summaries": "ACTIVE",
            "fin_invoices": "UNPAID",
            "fin_payment_transactions": ["created", "authorized", "captured", "failed", "refunded"][index % 5],
            "fin_receipts": "PAID",
            "intern_applications": "PENDING",
            "intern_assessments": "DRAFT",
            "intern_tasks": "TODO",
            "intern_mentor_assignments": "ACTIVE",
            "intern_opportunities": "OPEN",
            "intern_attendance": "PRESENT",
            "sup_tickets": "OPEN",
            "sup_feedback_sessions": "ACTIVE",
            "sys_verification_records": "VERIFIED",
        }
        if table_name in status_map:
            return status_map[table_name]
        if table_name.startswith("comm_"):
            return ["ACTIVE", "ARCHIVED", "DRAFT"][index % 3]
        if table_name.startswith("sup_"):
            return ["OPEN", "IN_PROGRESS", "CLOSED"][index % 3]
        if table_name.startswith("analytics_"):
            return ["PENDING", "PROCESSING", "COMPLETED", "FAILED"][index % 4]
        if table_name.startswith("alum_"):
            return ["APPLIED", "SCHEDULED", "ISSUED", "APPROVED"][index % 4]
        return ["ACTIVE", "PENDING", "ARCHIVED"][index % 3]
    if column_name == "action":
        return ["CREATE", "READ", "UPDATE", "DELETE", "VERIFY", "APPROVE"][index % 6]
    if column_name == "module_name":
        return ["dashboard", "users", "attendance", "reports", "notifications"][index % 5]
    if column_name == "payment_method":
        return ["upi", "card", "netbanking", "wallet"][index % 4]
    if column_name == "change_type":
        return ["increase", "decrease", "neutral"][index % 3]
    if column_name == "trend":
        return ["up", "down", "flat"][index % 3]
    if column_name == "risk_level":
        return ["Low", "Medium", "High", "Critical"][index % 4]
    if column_name == "format":
        return ["PDF", "Excel", "CSV", "JSON"][index % 4]
    if column_name == "account_status":
        return "ACTIVE"
    if column_name == "entity_type":
        return "student_profile"
    if column_name == "aadhaar_number":
        return f"{100000000000 + index:012d}"
    if column_name == "currency":
        return "INR"
    if column_name == "graduation_year":
        return date.today().year - 1
    if column_name == "country":
        return "India"
    if column_name == "state":
        return "Karnataka"
    if column_name == "city":
        return "Bengaluru"
    if column_name == "postal_code":
        return f"560{100 + index:03d}"
    return f"{humanize(table_name)} {humanize(column_name)} {index + 1}"


def numeric_value(column_name: str, index: int) -> Any:
    if column_name in {"version_id"}:
        return 1
    if column_name in {"is_active", "email_verified", "phone_verified", "is_trusted", "is_verified", "is_system", "refund"}:
        return True
    if column_name in {"is_pinned", "is_revoked"}:
        return index % 2 == 1
    if column_name in {"is_current", "is_mentoring", "is_primary_contact", "is_available"}:
        return index % 2 == 0
    if column_name in {"failed_login_attempts", "attempts", "students_count", "faculty_count", "internships_count", "students_managed", "programs_managed", "applications_processed", "attendance_approvals", "internship_completions", "max_capacity", "order_index", "total_students", "active_interns", "certificates_issued", "duration_months", "years_of_experience", "national_ranking", "referrals_provided"}:
        return index + 1
    if column_name in {"score", "max_score", "rating", "completion_rate", "attendance_rate", "average_score", "placement_rate", "revenue", "change_value", "amount", "amount_paid", "sub_total", "tax_amount", "discount", "grand_total", "ctc"}:
        if column_name in {"score", "max_score", "rating"}:
            return Decimal(str(70 + (index % 5) * 5))
        if column_name in {"completion_rate", "attendance_rate", "average_score", "placement_rate", "change_value"}:
            return Decimal(str(65 + (index % 4) * 3))
        return Decimal(str(1000 + index * 250))
    return index + 1


def temporal_value(column_name: str, index: int) -> Any:
    if column_name in {"created_at", "updated_at", "login_time", "last_activity_at", "publish_date", "scheduled_time", "payment_date", "verification_date", "expiry_date", "expires_at", "end_date", "logout_time", "account_locked_until", "issue_date", "drive_date", "joining_date", "start_date", "due_date", "razorpay_created_at"}:
        if column_name in {"issue_date", "drive_date", "joining_date", "start_date", "due_date"}:
            return date.today() - timedelta(days=30 - index)
        if column_name == "end_date":
            return date.today() + timedelta(days=30 + index)
        if column_name in {"expires_at", "expiry_date", "account_locked_until"}:
            return NOW + timedelta(days=30 - index)
        return NOW - timedelta(days=index)
    if column_name == "date":
        return date.today() - timedelta(days=index)
    return None


def json_value(column_name: str, index: int) -> Any:
    if column_name in {"variables", "skills", "notification_preferences", "accessibility_settings", "dashboard_layout", "notes"}:
        return {"sample": True, "index": index}
    return None


def resolve_fk_value(column, index: int, state: dict[str, list[Any]]):
    foreign_key = next(iter(column.foreign_keys), None)
    if foreign_key is None:
        return None
    parent_table = foreign_key.column.table.name
    parent_rows = state.get(parent_table, [])
    if not parent_rows:
        return None
    parent_obj = parent_rows[index % len(parent_rows)]
    return getattr(parent_obj, foreign_key.column.key)


def build_generic_rows(table, state: dict[str, list[Any]], desired_count: int = 1) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    columns = list(table.columns)
    for index in range(desired_count):
        row: dict[str, Any] = {}
        for column in columns:
            if column.primary_key and column.name == "id":
                continue
            if column.name in {"created_at", "updated_at", "deleted_at", "version_id"}:
                continue

            value = None
            if column.foreign_keys:
                value = resolve_fk_value(column, index, state)
            elif column.name in {"description", "content", "content_html", "html_body", "message", "answer", "feedback", "comments", "mitigation"}:
                value = string_value(table.name, column.name, index)
            elif column.name in {"name", "title", "subject", "question", "code", "username", "enrollment_number", "employee_code", "transaction_id", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "receipt", "customer_name", "receipt_number", "invoice_number", "certificate_number", "email", "customer_email", "verifier_email", "recipient_email", "phone", "customer_contact", "website", "file_url", "logo_url", "profile_image_url", "front_design_url", "back_design_url", "video_url", "push_notification_token", "ip_address", "user_agent", "browser", "operating_system", "platform", "category", "theme", "purpose", "result", "type", "priority", "status", "action", "module_name", "payment_method", "change_type", "risk_level", "format", "account_status", "entity_type", "aadhaar_number", "country", "state", "city", "postal_code", "currency"}:
                value = string_value(table.name, column.name, index)
            elif column.name in {"is_active", "email_verified", "phone_verified", "is_trusted", "is_verified", "is_system", "is_pinned", "is_revoked", "is_current", "is_mentoring", "is_primary_contact", "is_available"}:
                value = numeric_value(column.name, index)
            elif column.name in {"score", "max_score", "rating", "completion_rate", "attendance_rate", "average_score", "placement_rate", "revenue", "change_value", "amount", "amount_paid", "sub_total", "tax_amount", "discount", "grand_total", "ctc"}:
                value = numeric_value(column.name, index)
            elif column.name in {"duration_months", "years_of_experience", "national_ranking", "referrals_provided", "students_count", "faculty_count", "internships_count", "students_managed", "programs_managed", "applications_processed", "attendance_approvals", "internship_completions", "max_capacity", "order_index", "failed_login_attempts", "attempts", "total_students", "active_interns", "certificates_issued", "duration_months"}:
                value = numeric_value(column.name, index)
            elif column.name in {"created_at", "updated_at", "login_time", "last_activity_at", "publish_date", "scheduled_time", "payment_date", "verification_date", "expires_at", "expiry_date", "end_date", "logout_time", "account_locked_until", "issue_date", "drive_date", "joining_date", "start_date", "due_date", "date"}:
                value = temporal_value(column.name, index)
            elif column.name in {"variables", "skills", "notification_preferences", "accessibility_settings", "dashboard_layout", "notes"} and type(column.type).__name__ == "JSONB":
                value = json_value(column.name, index)
            elif column.name == "graduation_year":
                value = date.today().year - 1
            elif column.name == "is_trusted":
                value = True
            elif column.name == "version_id":
                value = 1
            else:
                try:
                    python_type = column.type.python_type
                except Exception:
                    python_type = str

                if python_type is bool:
                    value = False
                elif python_type is int:
                    value = index + 1
                elif python_type is float:
                    value = float(index + 1)
                elif python_type.__name__ == "Decimal":
                    value = Decimal(str(index + 1))
                elif python_type is uuid.UUID:
                    value = uuid.uuid4()
                elif python_type is date:
                    value = date.today() - timedelta(days=index)
                elif python_type is datetime:
                    value = NOW - timedelta(days=index)
                else:
                    value = string_value(table.name, column.name, index)

            if value is None and not column.nullable:
                value = string_value(table.name, column.name, index)

            row[column.name] = value

        rows.append(row)

    return rows


def seed_reference_data(session: Session, state: dict[str, list[Any]]):
    seed_rows(session, "ref_genders", [
        {"name": "Male", "is_active": True},
        {"name": "Female", "is_active": True},
        {"name": "Non-Binary", "is_active": True},
        {"name": "Other", "is_active": True},
        {"name": "Prefer not to say", "is_active": True},
    ], state)

    seed_rows(session, "ref_blood_groups", [
        {"name": "A+", "is_active": True},
        {"name": "A-", "is_active": True},
        {"name": "B+", "is_active": True},
        {"name": "B-", "is_active": True},
        {"name": "AB+", "is_active": True},
        {"name": "AB-", "is_active": True},
        {"name": "O+", "is_active": True},
        {"name": "O-", "is_active": True},
    ], state)

    countries = seed_rows(session, "ref_countries", [
        {"name": "India", "iso_code_2": "IN", "iso_code_3": "IND", "phone_code": "+91", "is_active": True},
        {"name": "United States", "iso_code_2": "US", "iso_code_3": "USA", "phone_code": "+1", "is_active": True},
        {"name": "United Kingdom", "iso_code_2": "GB", "iso_code_3": "GBR", "phone_code": "+44", "is_active": True},
        {"name": "Canada", "iso_code_2": "CA", "iso_code_3": "CAN", "phone_code": "+1", "is_active": True},
    ], state)

    states = seed_rows(session, "ref_states", [
        {"country_id": countries[0].id, "name": "Karnataka", "code": "KA", "is_active": True},
        {"country_id": countries[0].id, "name": "Tamil Nadu", "code": "TN", "is_active": True},
        {"country_id": countries[1].id, "name": "California", "code": "CA", "is_active": True},
        {"country_id": countries[2].id, "name": "England", "code": "ENG", "is_active": True},
    ], state)

    cities = seed_rows(session, "ref_cities", [
        {"state_id": states[0].id, "name": "Bengaluru", "is_active": True},
        {"state_id": states[1].id, "name": "Chennai", "is_active": True},
        {"state_id": states[2].id, "name": "San Francisco", "is_active": True},
        {"state_id": states[3].id, "name": "London", "is_active": True},
    ], state)

    seed_rows(session, "ref_timezones", [
        {"name": "UTC", "offset": "+00:00", "is_active": True},
        {"name": "Asia/Kolkata", "offset": "+05:30", "is_active": True},
        {"name": "America/Los_Angeles", "offset": "-08:00", "is_active": True},
        {"name": "Europe/London", "offset": "+00:00", "is_active": True},
    ], state)

    seed_rows(session, "ref_currencies", [
        {"name": "Indian Rupee", "code": "INR", "symbol": "₹", "is_active": True},
        {"name": "US Dollar", "code": "USD", "symbol": "$", "is_active": True},
        {"name": "British Pound", "code": "GBP", "symbol": "£", "is_active": True},
    ], state)

    seed_rows(session, "ref_languages", [
        {"name": "English", "code": "en", "is_active": True},
        {"name": "Hindi", "code": "hi", "is_active": True},
        {"name": "Kannada", "code": "kn", "is_active": True},
        {"name": "Tamil", "code": "ta", "is_active": True},
    ], state)

    document_types = seed_rows(session, "ref_document_types", [
        {"name": "Resume", "is_active": True},
        {"name": "Aadhar", "is_active": True},
        {"name": "PAN", "is_active": True},
        {"name": "Offer Letter", "is_active": True},
        {"name": "Certificate", "is_active": True},
        {"name": "Transcript", "is_active": True},
    ], state)

    seed_rows(session, "ref_notification_types", [
        {"name": "Email", "is_active": True},
        {"name": "SMS", "is_active": True},
        {"name": "Push", "is_active": True},
        {"name": "In-App", "is_active": True},
    ], state)

    seed_rows(session, "sys_settings", [
        {"key": "site_name", "value": "Internship ERP", "description": "Display name", "is_system": True},
        {"key": "support_email", "value": "support@example.com", "description": "System support email", "is_system": True},
        {"key": "default_timezone", "value": "Asia/Kolkata", "description": "Primary timezone", "is_system": True},
        {"key": "attendance_window_days", "value": "30", "description": "Attendance rolling window", "is_system": True},
    ], state)

    seed_rows(session, "sys_document_templates", [
        {"name": "Internship Certificate", "document_type_id": pick(document_types, 4).id, "description": "Certificate template", "variables": {"student_name": "", "batch": ""}},
        {"name": "Offer Letter", "document_type_id": pick(document_types, 3).id, "description": "Offer letter template", "variables": {"candidate_name": "", "company": ""}},
        {"name": "Completion Report", "document_type_id": pick(document_types, 5).id, "description": "Completion report template", "variables": {"student_name": "", "summary": ""}},
    ], state)

    seed_rows(session, "sys_idcard_templates", [
        {"name": "Student ID Card", "front_design_url": "https://example.com/idcards/student-front.png", "back_design_url": "https://example.com/idcards/student-back.png", "status": "ACTIVE"},
        {"name": "Staff ID Card", "front_design_url": "https://example.com/idcards/staff-front.png", "back_design_url": "https://example.com/idcards/staff-back.png", "status": "ACTIVE"},
    ], state)

    seed_rows(session, "comm_email_templates", [
        {"name": "Welcome Email", "category": "Onboarding", "subject": "Welcome to Internship ERP", "html_body": "<p>Welcome to the platform.</p>", "variables": {"name": ""}},
        {"name": "Password Reset", "category": "Security", "subject": "Reset your password", "html_body": "<p>Reset your password using the link.</p>", "variables": {"link": ""}},
        {"name": "Attendance Reminder", "category": "Attendance", "subject": "Submit your attendance", "html_body": "<p>Please update attendance.</p>", "variables": {"date": ""}},
        {"name": "Certificate Issued", "category": "Documents", "subject": "Your certificate is ready", "html_body": "<p>Your certificate has been generated.</p>", "variables": {"certificate_number": ""}},
    ], state)

    seed_rows(session, "sup_faqs", [
        {"question": "How do I log in?", "answer": "Use your official email and password.", "category": "Authentication"},
        {"question": "How do I upload a document?", "answer": "Open Documents and upload the required file.", "category": "Documents"},
        {"question": "How can I reset my password?", "answer": "Use the Forgot Password option on the login screen.", "category": "Authentication"},
        {"question": "Where do I view attendance?", "answer": "Attendance is available under My Attendance.", "category": "Attendance"},
        {"question": "How do I contact support?", "answer": "Raise a ticket from the Help Desk module.", "category": "Support"},
    ], state)


def seed_rbac_data(session: Session, state: dict[str, list[Any]]):
    roles = seed_rows(session, "rbac_roles", [
        {"name": "Super Admin", "code": "SUPER_ADMIN", "description": "System administrator", "is_system": True},
        {"name": "HR", "code": "HR", "description": "Human Resources", "is_system": True},
        {"name": "College Coordinator", "code": "COLLEGE_COORDINATOR", "description": "College coordinator", "is_system": True},
        {"name": "Mentor", "code": "MENTOR", "description": "Mentor", "is_system": True},
        {"name": "Student", "code": "STUDENT", "description": "Student", "is_system": True},
        {"name": "Management", "code": "MANAGEMENT", "description": "Management", "is_system": True},
        {"name": "Finance Manager", "code": "FINANCE_MANAGER", "description": "Finance Manager", "is_system": True},
    ], state)

    modules = seed_rows(session, "rbac_modules", [
        {"name": "Dashboard", "code": "dashboard", "description": "Dashboard module", "route_path": "/feature"},
        {"name": "Users", "code": "users", "description": "Users module", "route_path": "/feature/users"},
        {"name": "Roles", "code": "roles", "description": "Roles module", "route_path": "/feature/roles"},
        {"name": "Module Registry", "code": "modules", "description": "Module registry", "route_path": "/feature/modules"},
        {"name": "Security Center", "code": "security", "description": "Security center", "route_path": "/feature/security"},
        {"name": "Organization Management", "code": "organization", "description": "Organization management", "route_path": "/feature/organization"},
        {"name": "Program Management", "code": "program", "description": "Academic programs", "route_path": "/feature/program"},
        {"name": "Batch Management", "code": "batch", "description": "Batch management", "route_path": "/feature/batch"},
        {"name": "Student Management", "code": "student", "description": "Students", "route_path": "/feature/student"},
        {"name": "Mentor Profile", "code": "mentor", "description": "Mentors", "route_path": "/feature/mentor/profile"},
        {"name": "LMS Dashboard", "code": "lms", "description": "Learning management", "route_path": "/feature/lms"},
        {"name": "Attendance Dashboard", "code": "attendance", "description": "Attendance", "route_path": "/feature/attendance"},
        {"name": "Task Dashboard", "code": "task", "description": "Tasks", "route_path": "/feature/task"},
        {"name": "Assessment Dashboard", "code": "assessment", "description": "Assessments", "route_path": "/feature/assessment"},
        {"name": "Submissions", "code": "submission", "description": "Submissions", "route_path": "/feature/submissions"},
        {"name": "Performance", "code": "performance", "description": "Performance", "route_path": "/feature/performance"},
        {"name": "Communication Center", "code": "communication", "description": "Messages and email", "route_path": "/feature/communication"},
        {"name": "Notification Center", "code": "notification", "description": "Notifications", "route_path": "/feature/notifications"},
        {"name": "Calendar", "code": "calendar", "description": "Calendar", "route_path": "/feature/calendar"},
        {"name": "Email", "code": "email", "description": "Email templates", "route_path": "/feature/email"},
        {"name": "Certificate", "code": "certificate", "description": "Certificates", "route_path": "/feature/certificates"},
        {"name": "Document", "code": "document", "description": "Documents", "route_path": "/feature/documents"},
        {"name": "Placement", "code": "placement", "description": "Placement", "route_path": "/feature/placement"},
        {"name": "Alumni", "code": "alumni", "description": "Alumni", "route_path": "/feature/alumni"},
        {"name": "Analytics", "code": "analytics", "description": "Analytics", "route_path": "/feature/analytics"},
        {"name": "Reports", "code": "reports", "description": "Reports", "route_path": "/feature/reports"},
        {"name": "Help Desk", "code": "helpdesk", "description": "Help desk", "route_path": "/feature/helpdesk"},
        {"name": "Digital ID", "code": "idcard", "description": "ID card", "route_path": "/feature/id-card"},
        {"name": "Self Service", "code": "selfservice", "description": "Self service", "route_path": "/feature/self-service"},
        {"name": "Productivity", "code": "productivity", "description": "Productivity", "route_path": "/feature/productivity"},
    ], state)

    actions = seed_rows(session, "rbac_actions", [
        {"name": "Create", "code": "create", "description": "Create records"},
        {"name": "View", "code": "view", "description": "View records"},
        {"name": "Update", "code": "update", "description": "Update existing records"},
        {"name": "Delete", "code": "delete", "description": "Delete records"},
        {"name": "Manage", "code": "manage", "description": "Full access to records"},
        {"name": "Export", "code": "export", "description": "Export records to file"},
    ], state)

    feature_rows = []
    for module_obj in modules:
        feature_rows.append({
            "module_id": module_obj.id,
            "name": f"{module_obj.name} Access",
            "code": f"{module_obj.code}_access",
            "description": f"Access control for {module_obj.name}",
        })
    features = seed_rows(session, "rbac_features", feature_rows, state)

    permission_rows = []
    for feature_obj in features:
        # For our usecase, let's just use the action as the code suffix for permissions
        # We need to extract the base module code from the feature code.
        mod_code = feature_obj.code.replace('_access', '')
        for action_obj in actions:
            action_code = "view" if action_obj.code == "read" else action_obj.code
            permission_rows.append({
                "feature_id": feature_obj.id,
                "action_id": action_obj.id,
                "name": f"{mod_code}.{action_code}",
                "code": f"{mod_code}.{action_code}",
                "description": f"{action_obj.name} permission for {feature_obj.name}",
            })
    permissions = seed_rows(session, "rbac_permissions", permission_rows, state)

    groups = seed_rows(session, "rbac_permission_groups", [
        {"name": "Admin Core", "code": "ADMIN_CORE", "description": "Administrative permissions"},
        {"name": "Learning Core", "code": "LEARNING_CORE", "description": "Learning permissions"},
        {"name": "Operations Core", "code": "OPERATIONS_CORE", "description": "Operations permissions"},
        {"name": "Support Core", "code": "SUPPORT_CORE", "description": "Support permissions"},
    ], state)

    group_links = []
    for index, permission_obj in enumerate(permissions):
        group_links.append({
            "permission_group_id": groups[index % len(groups)].id,
            "permission_id": permission_obj.id,
        })
    seed_rows(session, "rbac_permission_group_permissions", group_links, state)

    role_group_links = []
    role_permission_links = []
    for index, role_obj in enumerate(roles):
        role_group_links.append({
            "role_id": role_obj.id,
            "permission_group_id": groups[index % len(groups)].id,
        })
        role_permission_links.append({
            "role_id": role_obj.id,
            "permission_id": permissions[index % len(permissions)].id,
        })
    seed_rows(session, "rbac_role_permission_groups", role_group_links, state)
    seed_rows(session, "rbac_role_permissions", role_permission_links, state)


def seed_org_and_academic_data(session: Session, state: dict[str, list[Any]]):
    countries = state["ref_countries"]
    states_ref = state["ref_states"]
    cities = state["ref_cities"]

    organizations = seed_rows(session, "org_organizations", [
        {"name": "Pinesphere Institute of Technology", "code": "PIT", "type": "Engineering", "email": "admin@pit.example.com", "phone": "+91-9000000001", "website": "https://pit.example.com", "address_line_1": "1 Campus Road", "city": "Bengaluru", "state": "Karnataka", "country": "India", "postal_code": "560001", "partnership_status": "Active", "nba_status": "Applied", "autonomous_status": "Affiliated", "naac_grade": "A+", "national_ranking": 42, "establishment_year": 2010, "university_affiliation": "State University"},
        {"name": "Pinesphere School of Commerce", "code": "PSC", "type": "Management", "email": "admin@psc.example.com", "phone": "+91-9000000002", "website": "https://psc.example.com", "address_line_1": "99 Commerce Avenue", "city": "Chennai", "state": "Tamil Nadu", "country": "India", "postal_code": "600001", "partnership_status": "Active", "nba_status": "Applied", "autonomous_status": "Affiliated", "naac_grade": "A", "national_ranking": 58, "establishment_year": 2012, "university_affiliation": "State University"},
    ], state)

    campus_rows = []
    for index, organization_obj in enumerate(organizations):
        campus_rows.extend([
            {"organization_id": organization_obj.id, "name": f"{organization_obj.name} Main Campus", "code": f"{organization_obj.code}-MAIN", "address_line1": f"{index + 1} Main St", "city_id": cities[index % len(cities)].id, "state_id": states_ref[index % len(states_ref)].id, "country_id": countries[0].id},
            {"organization_id": organization_obj.id, "name": f"{organization_obj.name} North Campus", "code": f"{organization_obj.code}-NORTH", "address_line1": f"{index + 2} North St", "city_id": cities[(index + 1) % len(cities)].id, "state_id": states_ref[(index + 1) % len(states_ref)].id, "country_id": countries[0].id},
        ])
    campuses = seed_rows(session, "org_campuses", campus_rows, state)

    department_rows = []
    department_specs = [
        ("Computer Science", "CSE"),
        ("Information Technology", "IT"),
        ("Business Administration", "MBA"),
        ("Electronics", "ECE"),
    ]
    for index, organization_obj in enumerate(organizations):
        for dept_index, (dept_name, dept_code) in enumerate(department_specs):
            department_rows.append({
                "organization_id": organization_obj.id,
                "campus_id": campuses[(index * 2 + dept_index) % len(campuses)].id,
                "name": f"{dept_name} Department",
                "code": f"{dept_code}{index + 1}",
                "hod_name": f"Dr. {dept_name.split()[0]} Patel",
                "students_count": 50 + dept_index * 10,
                "faculty_count": 5 + dept_index,
                "internships_count": 15 + dept_index,
                "placement_rate": 72.5 + dept_index,
                "status": "Active",
                "hod_user_id": None,
            })
    departments = seed_rows(session, "org_departments", department_rows, state)

    academic_years = seed_rows(session, "acad_academic_years", [
        {"name": "2025-2026", "start_date": date(2025, 6, 1), "end_date": date(2026, 5, 31), "is_current": False},
        {"name": "2026-2027", "start_date": date(2026, 6, 1), "end_date": date(2027, 5, 31), "is_current": True},
    ], state)

    program_specs = [
        ("B.Tech Computer Science", "BTECH-CS", 48),
        ("B.Tech Information Technology", "BTECH-IT", 48),
        ("MBA Business Analytics", "MBA-BA", 24),
        ("B.Sc Electronics", "BSC-EC", 36),
    ]
    programs = seed_rows(session, "acad_programs", [
        {
            "department_id": departments[index % len(departments)].id,
            "name": name,
            "code": code,
            "description": f"{humanize(name)} degree",
            "duration_months": duration_months,
            "program_type": "Degree",
        }
        for index, (name, code, duration_months) in enumerate(program_specs)
    ], state)

    semester_rows = []
    for program_obj in programs:
        for semester_number, academic_year_obj in enumerate(academic_years, start=1):
            semester_rows.append({
                "program_id": program_obj.id,
                "academic_year_id": academic_year_obj.id,
                "name": f"Semester {semester_number}",
                "start_date": academic_year_obj.start_date + timedelta(days=(semester_number - 1) * 120),
                "end_date": academic_year_obj.start_date + timedelta(days=semester_number * 120 - 1),
            })
    semesters = seed_rows(session, "acad_semesters", semester_rows, state)

    batch_rows = []
    for index, semester_obj in enumerate(semesters[:8]):
        batch_rows.append({
            "program_id": semester_obj.program_id,
            "semester_id": semester_obj.id,
            "name": f"Batch {2026 + index}",
            "code": f"B{2026 + index}-{index + 1}",
            "start_date": date(2026, 6, 1) + timedelta(days=index * 30),
            "end_date": date(2026, 12, 1) + timedelta(days=index * 30),
            "max_capacity": 40 + index * 5,
        })
    batches = seed_rows(session, "acad_batches", batch_rows, state)

    course_rows = []
    for program_obj in programs:
        for course_index in range(2):
            course_rows.append({
                "program_id": program_obj.id,
                "name": f"{program_obj.name} Subject {course_index + 1}",
                "code": f"{program_obj.code}-C{course_index + 1}",
                "credits": 3 + course_index,
                "description": f"Core subject {course_index + 1} for {program_obj.name}",
            })
    courses = seed_rows(session, "acad_courses", course_rows, state)

    seed_rows(session, "comp_companies", [
        {"name": "Nexus Solutions", "industry": "Software", "website": "https://nexus.example.com", "logo_url": "https://example.com/companies/nexus.png", "description": "Technology company", "is_active": True, "address_line1": "100 Tech Park", "city_id": cities[0].id, "state_id": states_ref[0].id, "country_id": countries[0].id, "postal_code": "560100"},
        {"name": "Apex Analytics", "industry": "Analytics", "website": "https://apex.example.com", "logo_url": "https://example.com/companies/apex.png", "description": "Analytics company", "is_active": True, "address_line1": "200 Data Street", "city_id": cities[1].id, "state_id": states_ref[1].id, "country_id": countries[0].id, "postal_code": "600100"},
        {"name": "BluePeak Ventures", "industry": "Consulting", "website": "https://bluepeak.example.com", "logo_url": "https://example.com/companies/bluepeak.png", "description": "Consulting company", "is_active": True, "address_line1": "300 Market Road", "city_id": cities[2].id, "state_id": states_ref[2].id, "country_id": countries[1].id, "postal_code": "94101"},
    ], state)


def seed_users_and_profiles(session: Session, state: dict[str, list[Any]]):
    roles_by_code = {role.code: role for role in state["rbac_roles"]}
    organizations = state["org_organizations"]
    departments = state["org_departments"]
    companies = state["comp_companies"]
    languages = state["ref_languages"]

    user_specs = [
        ("superadmin", "admin", "SUPER_ADMIN", 1),
        ("mentor", "mentor", "MENTOR", 5),
        ("student", "student", "STUDENT", 30),
        ("employee", "employee", "EMPLOYEE", 5),
        ("faculty", "faculty", "FACULTY", 2),
        ("hr", "hr", "HR", 2),
        ("deptcoord", "deptcoord", "DEPT_COORDINATOR", 2),
        ("orgcoord", "orgcoord", "ORG_COORDINATOR", 2),
        ("recruiter", "recruiter", "RECRUITER", 3),
    ]

    user_rows: list[dict[str, Any]] = []
    role_assignments: list[str] = []
    for prefix, email_prefix, role_code, count in user_specs:
        for index in range(count):
            is_primary = prefix == "superadmin" and index == 0
            suffix = "" if is_primary else f"-{index + 1}"
            username = f"{prefix}{suffix}"
            email = "admin@pinesphere.example.com" if is_primary else f"{email_prefix}{suffix}@pinesphere.example.com"
            user_rows.append({
                "username": username,
                "email": email,
                "phone": f"+91-90000{len(user_rows) + 100:04d}",
                "password_hash": hash_password("ChangeMe@123"),
                "account_status": "ACTIVE",
                "email_verified": True,
                "phone_verified": True,
                "last_login_at": NOW - timedelta(days=index),
                "failed_login_attempts": 0,
                "account_locked_until": None,
                "password_changed_at": NOW - timedelta(days=30),
                "mfa_enabled": index % 2 == 0,
                "profile_image_url": f"https://example.com/users/{slug(username)}.png",
            })
            role_assignments.append(role_code)

    users = seed_rows(session, "auth_users", user_rows, state)

    fallback_role = next(iter(roles_by_code.values()))
    seed_rows(session, "rbac_user_roles", [
        {
            "user_id": user_obj.id,
            "role_id": roles_by_code.get(role_assignments[index], fallback_role).id,
        }
        for index, user_obj in enumerate(users)
    ], state)

    employee_users = users[1 + 5 + 30 : 1 + 5 + 30 + 5]
    mentor_users = users[1:6]
    student_users = users[6:36]
    faculty_users = users[36:38]
    hr_users = users[38:40]
    deptcoord_users = users[40:42]
    orgcoord_users = users[42:44]
    recruiter_users = users[44:47]

    employee_profiles = seed_rows(session, "profile_employees", [
        {
            "user_id": user_obj.id,
            "organization_id": organizations[index % len(organizations)].id,
            "department_id": departments[index % len(departments)].id,
            "first_name": ["Alice", "Bob", "Carol", "David", "Eve"][index % 5],
            "last_name": f"Employee{index + 1}",
            "email": f"employee-{index + 1}@pinesphere.example.com",
            "phone": f"+91-90001{index + 1:04d}",
            "employee_code": f"EMP{index + 1:03d}",
            "designation": ["Coordinator", "Assistant Manager", "Analyst", "Officer", "Executive"][index % 5],
            "date_of_joining": date(2023, 1, 1) + timedelta(days=index * 30),
        }
        for index, user_obj in enumerate(employee_users)
    ], state)

    mentor_profiles = seed_rows(session, "profile_mentors", [
        {"user_id": user_obj.id, "employee_profile_id": None, "expertise": ["Python", "Data Science", "DevOps", "UI/UX", "Management"][index % 5], "years_of_experience": 4 + index, "max_capacity": 10 + index, "is_available": True}
        for index, user_obj in enumerate(mentor_users)
    ], state)

    student_profiles = seed_rows(session, "profile_students", [
        {
            "user_id": user_obj.id,
            "organization_id": organizations[index % len(organizations)].id,
            "department_id": departments[index % len(departments)].id,
            "batch_id": state["acad_batches"][index % len(state["acad_batches"])].id,
            "enrollment_number": f"ENR{2026}{index + 1:03d}",
            "resume_url": f"https://example.com/resumes/student-{index + 1}.pdf",
            "github_url": f"https://github.com/student{index + 1}",
            "linkedin_url": f"https://linkedin.com/in/student{index + 1}",
            "skills": {"primary": ["Python", "SQL", "Communication"][index % 3], "secondary": ["Testing", "Design", "Analytics"][index % 3]},
        }
        for index, user_obj in enumerate(student_users)
    ], state)

    faculty_profiles = seed_rows(session, "profile_faculty", [
        {"user_id": user_obj.id, "department_id": departments[index % len(departments)].id, "employee_profile_id": employee_profiles[index % len(employee_profiles)].id, "academic_title": ["Dr.", "Prof."][index % 2], "specialization": ["Computer Science", "Business Analytics"][index % 2]}
        for index, user_obj in enumerate(faculty_users)
    ], state)

    hr_profiles = seed_rows(session, "profile_hr", [
        {"user_id": user_obj.id, "organization_id": organizations[index % len(organizations)].id, "employee_profile_id": employee_profiles[index % len(employee_profiles)].id, "hr_level": ["Manager", "Director"][index % 2], "territory_scope": ["North Campus", "South Campus"][index % 2]}
        for index, user_obj in enumerate(hr_users)
    ], state)

    deptcoord_profiles = seed_rows(session, "profile_dept_coordinators", [
        {"user_id": user_obj.id, "department_id": departments[index % len(departments)].id, "employee_profile_id": employee_profiles[index % len(employee_profiles)].id, "responsibility_scope": ["Final Year Internships", "Labs"][index % 2]}
        for index, user_obj in enumerate(deptcoord_users)
    ], state)

    orgcoord_profiles = seed_rows(session, "profile_org_coordinators", [
        {"user_id": user_obj.id, "organization_id": organizations[index % len(organizations)].id, "employee_profile_id": employee_profiles[index % len(employee_profiles)].id, "title": ["Placement Officer", "Program Coordinator"][index % 2], "is_primary_contact": index % 2 == 0}
        for index, user_obj in enumerate(orgcoord_users)
    ], state)

    recruiter_profiles = seed_rows(session, "profile_recruiters", [
        {"user_id": user_obj.id, "company_id": companies[index % len(companies)].id, "designation": ["Talent Partner", "HR Manager", "Recruiter"][index % 3], "is_primary_contact": index == 0, "is_verified": True}
        for index, user_obj in enumerate(recruiter_users)
    ], state)

    preference_rows = []
    for index, user_obj in enumerate(users):
        preference_rows.append({
            "user_id": user_obj.id,
            "language_id": languages[index % len(languages)].id,
            "timezone_id": state["ref_timezones"][1].id,
            "theme": ["system", "light", "dark"][index % 3],
            "notification_preferences": {"email": True, "sms": index % 2 == 0, "push": True},
            "accessibility_settings": {"high_contrast": index % 3 == 0},
            "dashboard_layout": {"widgets": ["summary", "timeline", "tasks"]},
        })
    seed_rows(session, "auth_user_preferences", preference_rows, state)

    device_rows = []
    session_rows = []
    otp_rows = []
    token_rows = []
    login_rows = []
    for index, user_obj in enumerate(users[:8]):
        device_rows.append({"user_id": user_obj.id, "device_name": f"{user_obj.username.title()} Laptop", "platform": "Web", "os": "Windows 11", "browser": "Chrome", "push_notification_token": f"token-{index + 1}", "is_trusted": True, "last_seen_at": NOW - timedelta(days=index)})
        session_rows.append({"user_id": user_obj.id, "device_id": None, "ip_address": f"10.0.0.{index + 10}", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "login_time": NOW - timedelta(days=index), "last_activity_at": NOW - timedelta(days=index, hours=1), "expires_at": NOW + timedelta(days=7 - index), "is_revoked": False})
        token_rows.append({"user_id": user_obj.id, "token_hash": f"refresh-{index + 1}", "expires_at": NOW + timedelta(days=30), "is_revoked": False, "replaced_by_token": None})
        login_rows.append({"user_id": user_obj.id, "session_id": None, "login_time": NOW - timedelta(days=index), "logout_time": None, "ip_address": f"10.0.1.{index + 10}", "country": "India", "city": "Bengaluru", "browser": "Chrome", "operating_system": "Windows 11", "platform": "Web", "result": "SUCCESS", "failure_reason": None})
        otp_rows.append({"user_id": user_obj.id, "purpose": "MFA", "code_hash": f"otp-{index + 1}", "expires_at": NOW + timedelta(minutes=10), "attempts": 0, "is_verified": True})
    seed_rows(session, "auth_devices", device_rows, state)
    seed_rows(session, "auth_sessions", session_rows, state)
    seed_rows(session, "auth_refresh_tokens", token_rows, state)
    seed_rows(session, "auth_login_history", login_rows, state)
    seed_rows(session, "auth_otps", otp_rows, state)

    state["profile_employees"] = employee_profiles
    state["profile_mentors"] = mentor_profiles
    state["profile_students"] = student_profiles
    state["profile_faculty"] = faculty_profiles
    state["profile_hr"] = hr_profiles
    state["profile_dept_coordinators"] = deptcoord_profiles
    state["profile_org_coordinators"] = orgcoord_profiles
    state["profile_recruiters"] = recruiter_profiles


def seed_file_records(session: Session, state: dict[str, list[Any]]):
    existing = existing_rows(session, "file_records")
    if existing:
        state["file_records"] = existing
        return existing

    users = state.get("auth_users", [])
    if not users:
        return []

    # Get UUIDs for uploaded_by / approved_by
    admin_id = users[0].id
    mentor_id = users[1].id
    student_id = users[6].id

    # Create realistic files
    files_data = [
        # Certificate v1 (Archived)
        {
            "file_name": "Certificate_v1.pdf",
            "display_name": "Certificate (Initial)",
            "unique_file_name": "cert-12345-v1.pdf",
            "description": "Student internship certificate draft version",
            "file_type": "application/pdf",
            "file_extension": "pdf",
            "file_size": 150000,
            "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "storage_provider": "S3",
            "storage_path": "s3://erp-bucket/certificates/cert-12345-v1.pdf",
            "public_url": "https://s3.amazonaws.com/erp-bucket/certificates/cert-12345-v1.pdf",
            "thumbnail_url": None,
            "preview_url": "https://s3.amazonaws.com/erp-bucket/certificates/cert-12345-v1.pdf?preview=1",
            "category": "Certificate",
            "module_name": "certificate",
            "entity_name": "intern_certificates",
            "entity_id": uuid.uuid4(),
            "folder_name": "certificates",
            "tags": ["student", "certificate"],
            "version": 1,
            "is_latest": False,
            "status": FileStatusEnum.ARCHIVED,
            "uploaded_by": student_id,
            "approved_by": admin_id,
            "approved_at": NOW - timedelta(days=10),
            "expires_at": None,
            "download_count": 5,
            "last_downloaded_at": NOW - timedelta(days=2),
            "is_public": False,
            "is_downloadable": True,
            "is_editable": False,
            "is_confidential": False,
            "access_level": AccessLevelEnum.RESTRICTED,
            "remarks": "Replaced by version 2",
            "file_metadata": {"student_name": "Alice Smith", "completion_date": "2026-05-01"}
        },
        # Certificate v2 (Latest, Active)
        {
            "file_name": "Certificate_v2.pdf",
            "display_name": "Certificate (Final)",
            "unique_file_name": "cert-12345-v2.pdf",
            "description": "Student internship certificate final version",
            "file_type": "application/pdf",
            "file_extension": "pdf",
            "file_size": 152000,
            "checksum": "8f4384a51e600570b777a8360f7e1b5fa4277c44df3866d03d0cf3b2f5df8b56",
            "storage_provider": "S3",
            "storage_path": "s3://erp-bucket/certificates/cert-12345-v2.pdf",
            "public_url": "https://s3.amazonaws.com/erp-bucket/certificates/cert-12345-v2.pdf",
            "thumbnail_url": None,
            "preview_url": "https://s3.amazonaws.com/erp-bucket/certificates/cert-12345-v2.pdf?preview=1",
            "category": "Certificate",
            "module_name": "certificate",
            "entity_name": "intern_certificates",
            "entity_id": uuid.uuid4(),
            "folder_name": "certificates",
            "tags": ["student", "certificate"],
            "version": 2,
            "is_latest": True,
            "status": FileStatusEnum.ACTIVE,
            "uploaded_by": student_id,
            "approved_by": admin_id,
            "approved_at": NOW - timedelta(days=5),
            "expires_at": None,
            "download_count": 12,
            "last_downloaded_at": NOW - timedelta(hours=3),
            "is_public": False,
            "is_downloadable": True,
            "is_editable": False,
            "is_confidential": False,
            "access_level": AccessLevelEnum.RESTRICTED,
            "remarks": "Final approved certificate",
            "file_metadata": {"student_name": "Alice Smith", "completion_date": "2026-05-01"}
        },
        # Student Report (Active)
        {
            "file_name": "Student_Report.xlsx",
            "display_name": "Student Report",
            "unique_file_name": "report-student-2026.xlsx",
            "description": "Comprehensive student progress report for academic year 2026",
            "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "file_extension": "xlsx",
            "file_size": 2500000,
            "checksum": "3b29c8789bc8e560f7e1b5fa4277c44df3866d03d0cf3b2f5df8b56f8f4384a5",
            "storage_provider": "GCS",
            "storage_path": "gcs://erp-bucket/reports/report-student-2026.xlsx",
            "public_url": None,
            "thumbnail_url": None,
            "preview_url": None,
            "category": "Report",
            "module_name": "report",
            "entity_name": "student_profile",
            "entity_id": uuid.uuid4(),
            "folder_name": "reports",
            "tags": ["student", "report"],
            "version": 1,
            "is_latest": True,
            "status": FileStatusEnum.ACTIVE,
            "uploaded_by": mentor_id,
            "approved_by": None,
            "approved_at": None,
            "expires_at": None,
            "download_count": 45,
            "last_downloaded_at": NOW - timedelta(days=1),
            "is_public": False,
            "is_downloadable": True,
            "is_editable": True,
            "is_confidential": False,
            "access_level": AccessLevelEnum.INTERNAL,
            "remarks": "Weekly update report",
            "file_metadata": {"academic_year": 2026, "student_count": 30}
        },
        # Employee Profile (Active)
        {
            "file_name": "Employee_Profile.png",
            "display_name": "Employee Profile Image",
            "unique_file_name": "profile-emp-001.png",
            "description": "Profile picture of employee EMP001",
            "file_type": "image/png",
            "file_extension": "png",
            "file_size": 450000,
            "checksum": "a51e600570b777a8360f7e1b5fa4277c44df3866d03d0cf3b2f5df8b56f8f4384",
            "storage_provider": "Local",
            "storage_path": "/var/www/uploads/profiles/profile-emp-001.png",
            "public_url": "http://localhost:8000/uploads/profiles/profile-emp-001.png",
            "thumbnail_url": "http://localhost:8000/uploads/profiles/profile-emp-001_thumb.png",
            "preview_url": "http://localhost:8000/uploads/profiles/profile-emp-001.png",
            "category": "Profile",
            "module_name": "profile",
            "entity_name": "profile_employees",
            "entity_id": uuid.uuid4(),
            "folder_name": "profiles",
            "tags": ["employee", "profile"],
            "version": 1,
            "is_latest": True,
            "status": FileStatusEnum.ACTIVE,
            "uploaded_by": admin_id,
            "approved_by": None,
            "approved_at": None,
            "expires_at": None,
            "download_count": 0,
            "last_downloaded_at": None,
            "is_public": True,
            "is_downloadable": True,
            "is_editable": False,
            "is_confidential": False,
            "access_level": AccessLevelEnum.PUBLIC,
            "remarks": "Profile image uploaded during onboarding",
            "file_metadata": {"dimensions": "512x512"}
        },
        # Attendance Report (Active)
        {
            "file_name": "Attendance_Report.pdf",
            "display_name": "Attendance Report June",
            "unique_file_name": "attn-report-june.pdf",
            "description": "Monthly attendance verification report for June",
            "file_type": "application/pdf",
            "file_extension": "pdf",
            "file_size": 650000,
            "checksum": "b856f8f4384a51e600570b777a8360f7e1b5fa4277c44df3866d03d0cf3b2f5d",
            "storage_provider": "Azure",
            "storage_path": "azure://erp-bucket/attendance/attn-report-june.pdf",
            "public_url": None,
            "thumbnail_url": None,
            "preview_url": None,
            "category": "Report",
            "module_name": "attendance",
            "entity_name": "intern_attendance",
            "entity_id": uuid.uuid4(),
            "folder_name": "attendance",
            "tags": ["attendance", "report"],
            "version": 1,
            "is_latest": True,
            "status": FileStatusEnum.ACTIVE,
            "uploaded_by": mentor_id,
            "approved_by": admin_id,
            "approved_at": NOW - timedelta(days=2),
            "expires_at": None,
            "download_count": 8,
            "last_downloaded_at": NOW - timedelta(hours=12),
            "is_public": False,
            "is_downloadable": True,
            "is_editable": False,
            "is_confidential": True,
            "access_level": AccessLevelEnum.INTERNAL,
            "remarks": "Validated by Mentor",
            "file_metadata": {"month": "June", "year": 2026}
        },
        # Training Material (Draft)
        {
            "file_name": "Training_Material.docx",
            "display_name": "LMS Training Guide",
            "unique_file_name": "lms-training-guide-draft.docx",
            "description": "Draft training guide for the new LMS modules",
            "file_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "file_extension": "docx",
            "file_size": 1800000,
            "checksum": "cb2f5d8f4384a51e600570b777a8360f7e1b5fa4277c44df3866d03d0cf3b2f5",
            "storage_provider": "Local",
            "storage_path": "/var/www/uploads/documents/lms-training-guide-draft.docx",
            "public_url": None,
            "thumbnail_url": None,
            "preview_url": None,
            "category": "Document",
            "module_name": "lms",
            "entity_name": "lms_course_modules",
            "entity_id": uuid.uuid4(),
            "folder_name": "documents",
            "tags": ["training", "material"],
            "version": 1,
            "is_latest": True,
            "status": FileStatusEnum.DRAFT,
            "uploaded_by": mentor_id,
            "approved_by": None,
            "approved_at": None,
            "expires_at": None,
            "download_count": 1,
            "last_downloaded_at": NOW - timedelta(days=4),
            "is_public": False,
            "is_downloadable": True,
            "is_editable": True,
            "is_confidential": False,
            "access_level": AccessLevelEnum.INTERNAL,
            "remarks": "Work in progress",
            "file_metadata": {"author": "John Doe"}
        }
    ]

    from app.models.files.models import CommonFile
    objects = [CommonFile(**row) for row in files_data]
    session.add_all(objects)
    session.flush()
    state["file_records"] = objects
    return objects


def seed_remaining_tables(session: Session, state: dict[str, list[Any]]):
    for table in Base.metadata.sorted_tables:
        table_name = table.name
        if state.get(table_name):
            continue

        existing = existing_rows(session, table_name)
        if existing:
            state[table_name] = existing
            continue

        rows = build_generic_rows(table, state, ROW_COUNTS.get(table_name, 1))
        seed_rows(session, table_name, rows, state)


def validate_seed(session: Session):
    empty_tables = []
    for table in Base.metadata.sorted_tables:
        table_model = model(table.name)
        count = session.scalar(select(func.count()).select_from(table_model))
        if not count:
            empty_tables.append(table.name)
    if empty_tables:
        raise RuntimeError(f"Seed validation failed; empty tables remain: {', '.join(empty_tables)}")


def main() -> None:
    state: dict[str, list[Any]] = {}
    with SessionLocal() as session:
        seed_reference_data(session, state)
        seed_rbac_data(session, state)
        seed_org_and_academic_data(session, state)
        seed_users_and_profiles(session, state)
        seed_file_records(session, state)
        seed_remaining_tables(session, state)
        validate_seed(session)
        session.commit()

    print(f"Seeding completed successfully for {len(Base.metadata.tables)} tables.")


if __name__ == "__main__":
    main()