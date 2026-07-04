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
        # Skip mock seed/test phone numbers containing '900000' to avoid hitting Twilio limits
        cleaned = recipient.replace("-", "").replace(" ", "").replace("whatsapp:", "").replace("+91", "")
        if cleaned.startswith("900000"):
            print(f"| TWILIO MOCK WHATSAPP BYPASSED | Target: {recipient} | Message: {message[:60]}... |")
            return "skipped_mock_whatsapp"

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