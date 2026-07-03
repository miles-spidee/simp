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

        sender = settings.TWILIO_WHATSAPP_NUMBER
        if not sender.startswith("whatsapp:"):
            sender = f"whatsapp:{sender}"
            
        recipient = to
        # Development Redirect Mode - only redirect mock seed phone numbers
        cleaned = recipient.replace("-", "").replace(" ", "").replace("whatsapp:", "").replace("+91", "")
        if cleaned.startswith("900000"):
            message = f"[{recipient}] {message}"
            recipient = "+918248930835"

        if not recipient.startswith("whatsapp:"):
            recipient = f"whatsapp:{recipient}"

        whatsapp = await asyncio.to_thread(
            self.client.messages.create,
            body=message,
            from_=sender,
            to=recipient,
        )

        return whatsapp.sid


whatsapp_service = WhatsAppService()