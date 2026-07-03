from twilio.rest import Client

from app.core.config import settings


class SMSService:

    def __init__(self):
        self.client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
        )

    async def send_sms(
        self,
        to: str,
        message: str,
    ) -> str:
        """
        Send SMS using Twilio.

        Returns:
            Message SID
        """

        # Development Redirect Mode - only redirect mock seed phone numbers
        cleaned = to.replace("-", "").replace(" ", "").replace("+91", "")
        if cleaned.startswith("900000"):
            message = f"[{to}] {message}"
            to = "+918248930835"

        sms = self.client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to,
        )

        return sms.sid


sms_service = SMSService()