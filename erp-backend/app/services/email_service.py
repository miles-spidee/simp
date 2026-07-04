import asyncio
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class EmailService:

    async def send_email(
        self,
        to: str | list[str],
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

        # Convert to list and filter out mock emails
        recipients = [to] if isinstance(to, str) else list(to)
        real_recipients = []
        for r in recipients:
            if "@pinesphere.example.com" in r or "example.com" in r:
                print(f"| SMTP MOCK EMAIL BYPASSED | Target: {r} | Subject: {subject} |")
            else:
                real_recipients.append(r)

        if not real_recipients:
            return "skipped_mock_email"

        import email.utils

        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["Subject"] = subject
        msg["Date"] = email.utils.formatdate(localtime=True)
        msg["Message-ID"] = email.utils.make_msgid()
        msg["MIME-Version"] = "1.0"
        msg.attach(MIMEText(html, "html"))

        if len(real_recipients) > 1:
            msg["To"] = "undisclosed-recipients:;"
        else:
            msg["To"] = real_recipients[0]

        def sync_send():
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(smtp_user, real_recipients, msg.as_string())

        try:
            await asyncio.to_thread(sync_send)
            print(f"| SMTP EMAIL SUCCESS | Sent to: {real_recipients} | Subject: {subject} |")
            return "smtp_success"
        except Exception as e:
            print(f"| SMTP EMAIL FAILURE | Failed to send to: {real_recipients} | Error: {e} |")
            raise e


email_service = EmailService()