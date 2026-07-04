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

        # Skip mock seed/test phone numbers containing '900000' to avoid hitting Twilio limits
        cleaned = to.replace("-", "").replace(" ", "").replace("+91", "")
        if cleaned.startswith("900000"):
            print(f"| TWILIO MOCK SMS BYPASSED | Target: {to} | Message: {message[:60]}... |")
            return "skipped_mock_sms"

        sms = self.client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to,
        )

        return sms.sid


sms_service = SMSService()