import asyncio
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class EmailService:

    async def send_email(
        self,
        to: str,
        subject: str,
        html: str,
    ) -> str:
        """
        Send email using Gmail SMTP.
        """
        from app.core.config import settings
        smtp_host = settings.SMTP_HOST
        smtp_port = settings.SMTP_PORT
        smtp_user = settings.SMTP_USER
        smtp_password = settings.SMTP_PASSWORD

        # Development Redirect Mode - only redirect mock seed emails
        if "@pinesphere.example.com" in to or "example.com" in to:
            subject = f"[{to}] {subject}"
            to = "merllinyazhini005@gmail.com"

        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(html, "html"))

        def sync_send():
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(smtp_user, [to], msg.as_string())

        try:
            await asyncio.to_thread(sync_send)
            print(f"| SMTP EMAIL SUCCESS | Sent to: {to} | Subject: {subject} |")
            return "smtp_success"
        except Exception as e:
            print(f"| SMTP EMAIL FAILURE | Failed to send to: {to} | Error: {e} |")
            raise e


email_service = EmailService()