import asyncio
import uuid
import datetime
from app.services.email_service import email_service
from app.services.sms_service import sms_service
from app.services.whatsapp_service import whatsapp_service


class NotificationService:

    # Helper for In-App notifications
    @staticmethod
    def _add_in_app(title: str, message: str, recipient: str, module: str):
        try:
            from app.modules.notification.router import NOTIFICATIONS
            NOTIFICATIONS.insert(0, {
                "id": f"notif-{uuid.uuid4().hex[:4]}",
                "title": title,
                "message": message,
                "recipient": recipient,
                "role": "Student",
                "module": module,
                "channel": "In-App Notification",
                "priority": "Medium",
                "status": "Delivered",
                "readStatus": False,
                "retryCount": 0,
                "createdTime": datetime.datetime.now().isoformat()
            })
        except Exception:
            pass

    # Helper for Push notifications
    @staticmethod
    def _send_push(title: str, message: str, recipient: str):
        print(f"| PUSH | [Title]: {title} | [Message]: {message} | [Recipient]: {recipient} |")

    # 1. Login OTP (SMS only)
    @staticmethod
    async def send_login_otp(phone: str, otp: str):
        try:
            await sms_service.send_sms(phone, f"Your Pinesphere ERP Login OTP is {otp}. Valid for 5 minutes.")
        except Exception:
            pass

    # 2. Account Registration (Email, SMS, In-App)
    @classmethod
    async def send_account_registration(cls, username: str, email: str, phone: str):
        try:
            subject = "Account Registered"
            html = f"<h2>Welcome {username}</h2><p>Your registration is complete. Please verify your account.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, "Your Pinesphere ERP account registration is complete.")
        except Exception:
            pass

        cls._add_in_app("Account Registered", f"Hi {username}, your registration is complete.", email, "Identity")

    # 3. Welcome (Email, In-App)
    @classmethod
    async def send_welcome_notif(cls, username: str, email: str):
        try:
            subject = "Welcome to Pinesphere ERP"
            html = f"<h2>Welcome {username}</h2><p>Your profile has been created successfully. Welcome aboard!</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass
            
        cls._add_in_app("Welcome to Pinesphere ERP", "Your profile has been created successfully. Welcome aboard!", email, "Profile")

    # 4. Password Reset (Email, SMS)
    @staticmethod
    async def send_password_reset_otp(email: str, phone: str, otp: str):
        try:
            subject = "Password Reset OTP"
            html = f"<h2>Password Reset</h2><p>Your password reset OTP is: <h1>{otp}</h1></p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, f"Pinesphere ERP Password Reset OTP: {otp}")
        except Exception:
            pass

    # 5. Account Activation (Email, SMS, In-App)
    @classmethod
    async def send_account_activation(cls, username: str, email: str, phone: str):
        try:
            subject = "Account Activated"
            html = f"<h2>Account Activated</h2><p>Hi {username}, your account has been successfully activated.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, "Your Pinesphere ERP account has been successfully activated.")
        except Exception:
            pass

        cls._add_in_app("Account Activated", f"Hi {username}, your account has been successfully activated.", email, "Identity")

    # 6. Opportunity Published (Email, Push, In-App)
    @classmethod
    async def send_opportunity_published(cls, title: str, description: str, recipient_email: str):
        try:
            subject = f"New Opportunity Published: {title}"
            html = f"<h2>{title}</h2><p>{description}</p>"
            await email_service.send_email(recipient_email, subject, html)
        except Exception:
            pass

        cls._send_push(f"New Opportunity: {title}", description[:100], recipient_email)
        cls._add_in_app(f"New Opportunity: {title}", description[:200], recipient_email, "Opportunity")

    # 7. Application Submitted (Email, Push, In-App)
    @classmethod
    async def send_application_submitted(cls, username: str, email: str, opportunity_title: str):
        try:
            subject = "Application Submitted"
            html = f"<h2>Application Submitted</h2><p>Hi {username}, your application for '{opportunity_title}' has been submitted successfully.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Application Submitted", f"Your application for '{opportunity_title}' was submitted.", email)
        cls._add_in_app("Application Submitted", f"Your application for '{opportunity_title}' has been submitted successfully.", email, "Application")

    # 8. Application Approved (Email, Push, In-App)
    @classmethod
    async def send_application_approved(cls, username: str, email: str, opportunity_title: str):
        try:
            subject = "Application Approved"
            html = f"<h2>Application Approved</h2><p>Hi {username}, your application for '{opportunity_title}' has been approved!</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Application Approved", f"Your application for '{opportunity_title}' was approved.", email)
        cls._add_in_app("Application Approved", f"Your application for '{opportunity_title}' has been approved!", email, "Application")

    # 9. Application Rejected (Email, Push, In-App)
    @classmethod
    async def send_application_rejected(cls, username: str, email: str, opportunity_title: str):
        try:
            subject = "Application Status Update"
            html = f"<h2>Application Status Update</h2><p>Hi {username}, your application for '{opportunity_title}' has been reviewed and rejected.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Application Reviewed", f"Your application for '{opportunity_title}' was reviewed.", email)
        cls._add_in_app("Application Status Update", f"Your application for '{opportunity_title}' was rejected.", email, "Application")

    # 10. Interview Scheduled (Email, SMS, WhatsApp, Push, In-App)
    @classmethod
    async def send_interview_scheduled(cls, username: str, email: str, phone: str, date_str: str, time_str: str, venue: str):
        msg = f"Interview scheduled on {date_str} at {time_str} ({venue})."
        
        try:
            subject = "Interview Scheduled"
            html = f"<h2>Interview Scheduled</h2><p>Hi {username}, an interview has been scheduled on {date_str} at {time_str}. Venue: {venue}.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, msg)
        except Exception:
            pass

        try:
            await whatsapp_service.send_message(phone, msg)
        except Exception:
            pass

        cls._send_push("Interview Scheduled", msg, email)
        cls._add_in_app("Interview Scheduled", msg, email, "Interview")

    # 11. Interview Result (Email, SMS, Push, In-App)
    @classmethod
    async def send_interview_result(cls, username: str, email: str, phone: str, result_status: str):
        msg = f"Interview Result: {result_status}."
        
        try:
            subject = "Interview Result"
            html = f"<h2>Interview Result</h2><p>Hi {username}, your interview result is '{result_status}'.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, msg)
        except Exception:
            pass

        cls._send_push("Interview Result", msg, email)
        cls._add_in_app("Interview Result", msg, email, "Interview")

    # 12. Offer Letter Generated (Email, WhatsApp, Push, In-App)
    @classmethod
    async def send_offer_letter_generated(cls, username: str, email: str, phone: str, opportunity_title: str):
        msg = f"Your offer letter for '{opportunity_title}' has been generated. Please login to accept."
        
        try:
            subject = "Offer Letter Generated"
            html = f"<h2>Offer Letter</h2><p>Hi {username}, your offer letter for '{opportunity_title}' has been generated.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await whatsapp_service.send_message(phone, msg)
        except Exception:
            pass

        cls._send_push("Offer Letter Generated", msg, email)
        cls._add_in_app("Offer Letter Generated", msg, email, "Offer")

    # 13. Internship Start Reminder (Email, Push, In-App)
    @classmethod
    async def send_internship_start_reminder(cls, username: str, email: str, start_date: str):
        msg = f"Reminder: Your internship is starting on {start_date}."
        
        try:
            subject = "Internship Start Reminder"
            html = f"<h2>Internship Reminder</h2><p>Hi {username}, this is a reminder that your internship starts on {start_date}.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Internship Start Reminder", msg, email)
        cls._add_in_app("Internship Start Reminder", msg, email, "Internship")

    # 14. Batch Assigned (Email, Push, In-App)
    @classmethod
    async def send_batch_assigned(cls, username: str, email: str, batch_name: str):
        msg = f"You have been assigned to batch '{batch_name}'."
        
        try:
            subject = "Batch Assignment"
            html = f"<h2>Batch Assigned</h2><p>Hi {username}, you have been assigned to the batch '{batch_name}'.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Batch Assigned", msg, email)
        cls._add_in_app("Batch Assigned", msg, email, "Cohort")

    # 15. Mentor Assigned (Email, Push, In-App)
    @classmethod
    async def send_mentor_assigned(cls, username: str, email: str, mentor_name: str):
        msg = f"Mentor Assigned: {mentor_name}."
        
        try:
            subject = "Mentor Assigned"
            html = f"<h2>Mentor Assigned</h2><p>Hi {username}, your mentor is '{mentor_name}'.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Mentor Assigned", msg, email)
        cls._add_in_app("Mentor Assigned", msg, email, "Mentor")

    # 16. Assessment Published (Email, Push, In-App)
    @classmethod
    async def send_assessment_published(cls, username: str, email: str, assessment_title: str):
        msg = f"New Assessment Published: '{assessment_title}'."
        
        try:
            subject = "Assessment Published"
            html = f"<h2>New Assessment</h2><p>Hi {username}, a new assessment '{assessment_title}' has been published.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Assessment Published", msg, email)
        cls._add_in_app("Assessment Published", msg, email, "Assessment")

    # 17. Assessment Reminder (Email, Push, In-App)
    @classmethod
    async def send_assessment_reminder(cls, username: str, email: str, assessment_title: str, due_date: str):
        msg = f"Reminder: Assessment '{assessment_title}' is due by {due_date}."
        
        try:
            subject = "Assessment Due Reminder"
            html = f"<h2>Assessment Reminder</h2><p>Hi {username}, assessment '{assessment_title}' is due on {due_date}. Please complete it.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Assessment Due Reminder", msg, email)
        cls._add_in_app("Assessment Due Reminder", msg, email, "Assessment")

    # 18. Assessment Result Published (Email, Push, In-App)
    @classmethod
    async def send_assessment_result_published(cls, username: str, email: str, assessment_title: str, score: str):
        msg = f"Assessment Result Published for '{assessment_title}'. Score: {score}."
        
        try:
            subject = "Assessment Results"
            html = f"<h2>Assessment Result</h2><p>Hi {username}, your results for '{assessment_title}' have been published. Score: {score}.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Assessment Results Published", msg, email)
        cls._add_in_app("Assessment Results Published", msg, email, "Assessment")

    # 19. Task Assigned (Email, Push, In-App)
    @classmethod
    async def send_task_assigned(cls, username: str, email: str, task_title: str):
        msg = f"A new task '{task_title}' has been assigned to you."
        
        try:
            subject = "New Task Assigned"
            html = f"<h2>New Task Assigned</h2><p>Hi {username}, you have been assigned the task '{task_title}'.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("New Task Assigned", msg, email)
        cls._add_in_app("New Task Assigned", msg, email, "Task")

    # 20. Task Deadline Reminder (Email, Push, In-App)
    @classmethod
    async def send_task_deadline_reminder(cls, username: str, email: str, task_title: str, due_date: str):
        msg = f"Reminder: Task '{task_title}' is due by {due_date}."
        
        try:
            subject = "Task Deadline Reminder"
            html = f"<h2>Task Reminder</h2><p>Hi {username}, task '{task_title}' is due on {due_date}. Please submit it.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Task Deadline Reminder", msg, email)
        cls._add_in_app("Task Deadline Reminder", msg, email, "Task")

    # 21. Task Reviewed (Email, Push, In-App)
    @classmethod
    async def send_task_reviewed(cls, username: str, email: str, task_title: str, status: str, feedback: str):
        msg = f"Task '{task_title}' reviewed. Status: {status}."
        
        try:
            subject = "Task Reviewed"
            html = f"<h2>Task Reviewed</h2><p>Hi {username}, your task '{task_title}' was reviewed. Status: {status}. Feedback: {feedback}</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Task Reviewed", msg, email)
        cls._add_in_app("Task Reviewed", msg, email, "Task")

    # 22. Attendance Alert (SMS, Push, In-App)
    @classmethod
    async def send_attendance_alert(cls, username: str, email: str, phone: str, date_str: str, status: str):
        msg = f"Attendance Alert: Your attendance for {date_str} is marked as '{status}'."
        
        try:
            await sms_service.send_sms(phone, msg)
        except Exception:
            pass

        cls._send_push("Attendance Alert", msg, email)
        cls._add_in_app("Attendance Alert", msg, email, "Attendance")

    # 23. Attendance Approved (Email, Push, In-App)
    @classmethod
    async def send_attendance_approved(cls, username: str, email: str, date_str: str):
        msg = f"Your attendance for {date_str} has been approved."
        
        try:
            subject = "Attendance Correction Approved"
            html = f"<h2>Attendance Approved</h2><p>Hi {username}, your attendance correction for {date_str} has been approved.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Attendance Approved", msg, email)
        cls._add_in_app("Attendance Approved", msg, email, "Attendance")

    # 24. Leave Approved (Email, Push, In-App)
    @classmethod
    async def send_leave_approved(cls, username: str, email: str, leave_type: str, start_date: str, end_date: str):
        msg = f"Your leave request for {leave_type} ({start_date} to {end_date}) has been approved."
        
        try:
            subject = "Leave Approved"
            html = f"<h2>Leave Approved</h2><p>Hi {username}, your leave request for {leave_type} from {start_date} to {end_date} has been approved.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Leave Approved", msg, email)
        cls._add_in_app("Leave Approved", msg, email, "Leave")

    # 25. Leave Rejected (Email, Push, In-App)
    @classmethod
    async def send_leave_rejected(cls, username: str, email: str, leave_type: str, start_date: str, end_date: str):
        msg = f"Your leave request for {leave_type} ({start_date} to {end_date}) was rejected."
        
        try:
            subject = "Leave Status Update"
            html = f"<h2>Leave Rejected</h2><p>Hi {username}, your leave request for {leave_type} from {start_date} to {end_date} was rejected.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Leave Rejected", msg, email)
        cls._add_in_app("Leave Status Update", msg, email, "Leave")

    # 26. Certificate Generated (Email, WhatsApp, Push, In-App)
    @classmethod
    async def send_certificate_generated(cls, username: str, email: str, cert_name: str):
        msg = f"Your certificate for '{cert_name}' has been generated. Please login to download."
        
        try:
            subject = "Certificate Generated"
            html = f"<h2>Certificate Ready</h2><p>Hi {username}, your certificate for '{cert_name}' is ready for download.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await whatsapp_service.send_message(email, msg) # Twilio maps to recipient number
        except Exception:
            pass

        cls._send_push("Certificate Generated", msg, email)
        cls._add_in_app("Certificate Generated", msg, email, "Certificate")

    # 27. Document Generated (Email, Push, In-App)
    @classmethod
    async def send_document_generated(cls, username: str, email: str, doc_name: str):
        msg = f"Document '{doc_name}' has been successfully generated."
        
        try:
            subject = "Document Generated"
            html = f"<h2>Document Generated</h2><p>Hi {username}, the document '{doc_name}' has been generated.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Document Generated", msg, email)
        cls._add_in_app("Document Generated", msg, email, "Document")

    # 28. Payment Confirmation (Email, WhatsApp, In-App)
    @classmethod
    async def send_payment_confirmation(cls, username: str, email: str, phone: str, amount: str, tx_id: str):
        msg = f"Payment Successful! Received INR {amount}. Transaction ID: {tx_id}."
        
        try:
            subject = "Payment Successful"
            html = f"<h2>Payment Receipt</h2><p>Hi {username}, payment of INR {amount} was successful. Transaction ID: {tx_id}.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await whatsapp_service.send_message(phone, msg)
        except Exception:
            pass

        cls._add_in_app("Payment Successful", msg, email, "Payment")

    # 29. Fee Due Reminder (Email, SMS, WhatsApp, Push, In-App)
    @classmethod
    async def send_fee_due_reminder(cls, username: str, email: str, phone: str, amount: str, due_date: str):
        msg = f"Reminder: Fee payment of INR {amount} is due by {due_date}."
        
        try:
            subject = "Fee Due Reminder"
            html = f"<h2>Fee Reminder</h2><p>Hi {username}, fee of INR {amount} is due on {due_date}. Please pay to avoid penalties.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, msg)
        except Exception:
            pass

        try:
            await whatsapp_service.send_message(phone, msg)
        except Exception:
            pass

        cls._send_push("Fee Due Reminder", msg, email)
        cls._add_in_app("Fee Due Reminder", msg, email, "Payment")

    # 30. Payment Failed (Email, SMS, WhatsApp, In-App)
    @classmethod
    async def send_payment_failed(cls, username: str, email: str, phone: str, amount: str, error_msg: str):
        msg = f"Payment Failed for INR {amount}. Reason: {error_msg}."
        
        try:
            subject = "Payment Failed"
            html = f"<h2>Payment Failed</h2><p>Hi {username}, payment of INR {amount} has failed. Reason: {error_msg}. Please retry.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, msg)
        except Exception:
            pass

        try:
            await whatsapp_service.send_message(phone, msg)
        except Exception:
            pass

        cls._add_in_app("Payment Failed", msg, email, "Payment")

    # 31. Announcement Published (Push, In-App)
    @classmethod
    async def send_announcement_published(cls, title: str, message: str, recipient_email: str):
        cls._send_push(f"Announcement: {title}", message[:100], recipient_email)
        cls._add_in_app(f"New Announcement: {title}", message[:200], recipient_email, "Announcement")

    # 32. Help Desk Ticket Assigned (Email, Push, In-App)
    @classmethod
    async def send_help_desk_ticket_assigned(cls, username: str, email: str, ticket_id: str, ticket_title: str):
        msg = f"Ticket #{ticket_id} '{ticket_title}' has been assigned to a representative."
        
        try:
            subject = "Help Desk Ticket Assigned"
            html = f"<h2>Ticket Assigned</h2><p>Hi {username}, your ticket #{ticket_id} has been assigned.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Ticket Assigned", msg, email)
        cls._add_in_app("Ticket Assigned", msg, email, "HelpDesk")

    # 33. Help Desk Ticket Resolved (Email, Push, In-App)
    @classmethod
    async def send_help_desk_ticket_resolved(cls, username: str, email: str, ticket_id: str, ticket_title: str):
        msg = f"Ticket #{ticket_id} '{ticket_title}' has been marked as Resolved."
        
        try:
            subject = "Ticket Resolved"
            html = f"<h2>Ticket Resolved</h2><p>Hi {username}, your ticket #{ticket_id} has been resolved successfully.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Ticket Resolved", msg, email)
        cls._add_in_app("Ticket Resolved", msg, email, "HelpDesk")

    # 34. Reporting Manager Assignment (Email, Push, In-App)
    @classmethod
    async def send_reporting_manager_assignment(cls, username: str, email: str, manager_name: str):
        msg = f"Reporting Manager Assigned: {manager_name}."
        
        try:
            subject = "Reporting Manager Assignment"
            html = f"<h2>Reporting Manager Assigned</h2><p>Hi {username}, your reporting manager is '{manager_name}'.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("Reporting Manager Assigned", msg, email)
        cls._add_in_app("Reporting Manager Assigned", msg, email, "ReportingManager")

    # 35. KPI Below Threshold (Email, Push, In-App)
    @classmethod
    async def send_kpi_below_threshold(cls, username: str, email: str, kpi_name: str, value: str, threshold: str):
        msg = f"KPI Alert: Your KPI '{kpi_name}' has dropped to {value} (threshold is {threshold})."
        
        try:
            subject = "KPI Performance Alert"
            html = f"<h2>KPI Warning</h2><p>Hi {username}, your performance metric '{kpi_name}' is {value}, which is below the threshold of {threshold}.</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        cls._send_push("KPI Alert", msg, email)
        cls._add_in_app("KPI Alert", msg, email, "Performance")

    # 36. Escalation Level 1 (Email, SMS, Push, In-App)
    @classmethod
    async def send_escalation_level_1(cls, username: str, email: str, phone: str, escalation_title: str, details: str):
        msg = f"Escalation Level 1: {escalation_title}. Action required."
        
        try:
            subject = f"Escalation Level 1: {escalation_title}"
            html = f"<h2>Escalation Alert (L1)</h2><p>Hi {username}, an escalation of level 1 was raised. Details: {details}</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, msg)
        except Exception:
            pass

        cls._send_push("Escalation Level 1", msg, email)
        cls._add_in_app("Escalation Level 1", msg, email, "Escalation")

    # 37. Escalation Level 2 (Email, SMS, WhatsApp, Push, In-App)
    @classmethod
    async def send_escalation_level_2(cls, username: str, email: str, phone: str, escalation_title: str, details: str):
        msg = f"CRITICAL: Escalation Level 2: {escalation_title}."
        
        try:
            subject = f"Escalation Level 2: {escalation_title}"
            html = f"<h2>Escalation Alert (L2)</h2><p>Hi {username}, a critical escalation of level 2 was raised. Details: {details}</p>"
            await email_service.send_email(email, subject, html)
        except Exception:
            pass

        try:
            await sms_service.send_sms(phone, msg)
        except Exception:
            pass

        try:
            await whatsapp_service.send_message(phone, msg)
        except Exception:
            pass

        cls._send_push("Escalation Level 2", msg, email)
        cls._add_in_app("Escalation Level 2", msg, email, "Escalation")

    @classmethod
    async def send_credentials_email(cls, email: str, username: str, password: str):
        try:
            subject = "Your Pinesphere ERP Account Credentials"
            html = f"""
            <h2>Pinesphere ERP Account Created</h2>
            <p>An account has been created for you by the Super Admin.</p>
            <p><strong>Login URL:</strong> <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Password:</strong> {password}</p>
            <br/>
            <p>Please log in and change your password immediately.</p>
            """
            await email_service.send_email(email, subject, html)
        except Exception as e:
            print("Failed to send credentials email:", e)


notification_service = NotificationService()