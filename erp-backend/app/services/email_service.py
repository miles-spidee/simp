import asyncio

import resend

from app.core.config import settings


class EmailService:

    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY

    async def send_email(
        self,
        to: str,
        subject: str,
        html: str,
    ) -> str:
        """
        Send email using Resend.
        Returns the email ID.
        """

        response = await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": settings.EMAIL_FROM,
                "to": [to],
                "subject": subject,
                "html": html,
            },
        )

        return response["id"]


email_service = EmailService()