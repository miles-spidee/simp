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

        sms = self.client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to,
        )

        return sms.sid


sms_service = SMSService()