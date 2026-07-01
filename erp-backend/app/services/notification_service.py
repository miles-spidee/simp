from app.services.email_service import email_service
from app.services.sms_service import sms_service
from app.services.whatsapp_service import whatsapp_service


class NotificationService:

    # =====================================================
    # OTP
    # =====================================================

    @staticmethod
    async def send_otp(
        email: str,
        phone: str,
        otp: str,
    ):

        subject = "Pinesphere ERP OTP Verification"

        html = f"""
        <h2>Pinesphere ERP</h2>

        <p>Your OTP is:</p>

        <h1>{otp}</h1>

        <p>This OTP expires in 5 minutes.</p>
        """

        sms = f"Your Pinesphere ERP OTP is {otp}. Valid for 5 minutes."

        whatsapp = f"""
Pinesphere ERP

Your OTP is:

{otp}

Valid for 5 minutes.
"""

        await email_service.send_email(
            email,
            subject,
            html,
        )

        await sms_service.send_sms(
            phone,
            sms,
        )

        await whatsapp_service.send_message(
            phone,
            whatsapp,
        )

    # =====================================================
    # WELCOME
    # =====================================================

    @staticmethod
    async def send_welcome(
        username: str,
        email: str,
    ):

        subject = "Welcome to Pinesphere ERP"

        html = f"""
        <h2>Welcome {username}</h2>

        <p>Your account has been created successfully.</p>
        """

        await email_service.send_email(
            email,
            subject,
            html,
        )

    # =====================================================
    # PASSWORD RESET
    # =====================================================

    @staticmethod
    async def send_password_reset(
        email: str,
        phone: str,
        otp: str,
    ):

        subject = "Password Reset OTP"

        html = f"""
        <h2>Password Reset</h2>

        <h1>{otp}</h1>

        <p>OTP expires in 5 minutes.</p>
        """

        sms = f"Password Reset OTP: {otp}"

        await email_service.send_email(
            email,
            subject,
            html,
        )

        await sms_service.send_sms(
            phone,
            sms,
        )

    # =====================================================
    # INTERVIEW
    # =====================================================

    @staticmethod
    async def send_interview_notification(
        email: str,
        phone: str,
        interview_date: str,
        interview_time: str,
        venue: str,
    ):

        subject = "Interview Scheduled"

        html = f"""
        <h2>Interview Scheduled</h2>

        <p>Date : {interview_date}</p>

        <p>Time : {interview_time}</p>

        <p>Venue : {venue}</p>
        """

        sms = (
            f"Interview on {interview_date} "
            f"at {interview_time} ({venue})"
        )

        await email_service.send_email(
            email,
            subject,
            html,
        )

        await sms_service.send_sms(
            phone,
            sms,
        )

        await whatsapp_service.send_message(
            phone,
            sms,
        )

    # =====================================================
    # CERTIFICATE
    # =====================================================

    @staticmethod
    async def send_certificate_ready(
        email: str,
        phone: str,
    ):

        subject = "Certificate Available"

        html = """
        <h2>Your Internship Certificate is Ready.</h2>

        <p>Please login to the ERP portal to download it.</p>
        """

        sms = (
            "Your Internship Certificate "
            "is ready for download."
        )

        await email_service.send_email(
            email,
            subject,
            html,
        )

        await sms_service.send_sms(
            phone,
            sms,
        )

        await whatsapp_service.send_message(
            phone,
            sms,
        )

    # =====================================================
    # ANNOUNCEMENT
    # =====================================================

    @staticmethod
    async def send_announcement(
        email: str,
        phone: str,
        title: str,
        message: str,
    ):

        html = f"""
        <h2>{title}</h2>

        <p>{message}</p>
        """

        await email_service.send_email(
            email,
            title,
            html,
        )

        await whatsapp_service.send_message(
            phone,
            f"{title}\n\n{message}",
        )


notification_service = NotificationService()