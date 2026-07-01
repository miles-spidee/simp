import asyncio

from twilio.rest import Client

from app.core.config import settings


class WhatsAppService:

    def __init__(self):
        self.client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
        )

    async def send_message(
        self,
        to: str,
        message: str,
    ) -> str:
        """
        Send WhatsApp message.

        Example:
            to="+919876543210"
        """

        whatsapp = await asyncio.to_thread(
            self.client.messages.create,
            body=message,
            from_=f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
            to=f"whatsapp:{to}",
        )

        return whatsapp.sid


whatsapp_service = WhatsAppService()