from __future__ import annotations

import json
from typing import Any

from fastapi import HTTPException
from razorpay import Client
from razorpay.errors import BadRequestError, GatewayError, ServerError, SignatureVerificationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.client = Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    async def create_order(self, *, application_id: str) -> dict[str, Any]:
        """Create a Razorpay order for an application fee without persisting data yet."""
        if not application_id:
            raise HTTPException(status_code=400, detail="application_id is required")

        self._require_configured(["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_CURRENCY"])

        await self._validate_application(application_id=application_id)

        # Temporary hardcoded application fee in paise (INR 1000.00).
        amount = 100000
        currency = settings.RAZORPAY_CURRENCY

        order = self._create_razorpay_order(
            amount=amount,
            currency=currency,
            receipt=f"app_{application_id}",
            notes={"application_id": application_id},
        )

        # TODO:
        # Save Order draft/audit entry in database

        return {
            "order_id": order.get("id"),
            "amount": order.get("amount", amount),
            "currency": order.get("currency", currency),
            "status": order.get("status"),
        }

    async def verify_payment(
        self,
        *,
        razorpay_payment_id: str,
        razorpay_order_id: str,
        razorpay_signature: str,
    ) -> dict[str, Any]:
        """Verify Razorpay payment signature and payment capture status."""
        if not razorpay_payment_id or not razorpay_order_id or not razorpay_signature:
            raise HTTPException(status_code=400, detail="Payment verification fields are required")

        self._require_configured(["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"])

        self._verify_signature(
            razorpay_order_id=razorpay_order_id,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_signature=razorpay_signature,
        )

        payment = self._fetch_payment(razorpay_payment_id=razorpay_payment_id)

        if str(payment.get("order_id")) != razorpay_order_id:
            raise HTTPException(status_code=409, detail="Payment does not belong to the provided order")

        payment_status = str(payment.get("status", "")).lower()
        if payment_status != "captured":
            raise HTTPException(status_code=409, detail="Payment is not captured")

        # Validate amount consistency against the order details.
        try:
            order = self.client.order.fetch(razorpay_order_id)
        except BadRequestError as exc:
            raise HTTPException(status_code=404, detail="Order not found") from exc
        except (GatewayError, ServerError) as exc:
            raise HTTPException(status_code=502, detail="Razorpay order API failed") from exc
        except Exception as exc:
            raise HTTPException(status_code=503, detail="Razorpay service unavailable") from exc

        if int(payment.get("amount", 0)) != int(order.get("amount", 0)):
            raise HTTPException(status_code=409, detail="Payment amount mismatch")

        # TODO:
        # Save Payment in database
        # TODO:
        # Update Application Status in database
        # TODO:
        # Mark payment verified in database

        return {
            "verified": True,
            "payment_id": razorpay_payment_id,
            "order_id": razorpay_order_id,
            "status": payment.get("status"),
            "amount": payment.get("amount"),
            "currency": payment.get("currency"),
        }

    async def handle_webhook(self, *, payload: bytes, signature: str | None) -> dict[str, Any]:
        """Validate and process incoming Razorpay webhook events."""
        if not payload:
            raise HTTPException(status_code=400, detail="Webhook payload is required")
        if not signature:
            raise HTTPException(status_code=401, detail="Missing Razorpay webhook signature")

        self._require_configured(["RAZORPAY_WEBHOOK_SECRET"])

        self._verify_webhook_signature(payload=payload, signature=signature)

        try:
            event = json.loads(payload.decode("utf-8"))
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid Razorpay webhook payload") from exc

        event_type = str(event.get("event", ""))
        event_payload = event.get("payload", {})

        if event_type == "payment.captured":
            # TODO:
            # Save Payment in database
            # TODO:
            # Update Application Status in database
            pass
        elif event_type == "payment.failed":
            # TODO:
            # Save failed payment attempt in database
            # TODO:
            # Update Application Status in database
            pass
        elif event_type == "order.paid":
            # TODO:
            # Mark Order as paid in database
            pass

        return {
            "processed": True,
            "event": event_type,
            "payload": event_payload,
        }

    async def get_payment(self, *, razorpay_payment_id: str) -> dict[str, Any]:
        """Fetch a payment directly from Razorpay."""
        if not razorpay_payment_id:
            raise HTTPException(status_code=400, detail="razorpay_payment_id is required")

        self._require_configured(["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"])
        return self._fetch_payment(razorpay_payment_id=razorpay_payment_id)

    async def get_application_payment(self, *, application_id: str) -> dict[str, Any]:
        """Return application payment details (database placeholder for now)."""
        if not application_id:
            raise HTTPException(status_code=400, detail="application_id is required")

        await self._validate_application(application_id=application_id)

        # TODO:
        # Fetch Application from database

        # TODO:
        # Fetch latest Payment mapped to this application from database

        raise HTTPException(status_code=404, detail="Application payment details not found")

    def _create_razorpay_order(
        self,
        *,
        amount: int,
        currency: str,
        receipt: str,
        notes: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """Create an order in Razorpay."""
        try:
            return self.client.order.create(
                {
                    "amount": amount,
                    "currency": currency,
                    "receipt": receipt,
                    "payment_capture": 1,
                    "notes": notes or {},
                }
            )
        except BadRequestError as exc:
            raise HTTPException(status_code=400, detail="Invalid Razorpay order request") from exc
        except (GatewayError, ServerError) as exc:
            raise HTTPException(status_code=502, detail="Razorpay order API failed") from exc
        except Exception as exc:
            raise HTTPException(status_code=503, detail="Razorpay service unavailable") from exc

    def _fetch_payment(self, *, razorpay_payment_id: str) -> dict[str, Any]:
        """Fetch payment details from Razorpay by payment id."""
        try:
            payment = self.client.payment.fetch(razorpay_payment_id)
        except BadRequestError as exc:
            raise HTTPException(status_code=404, detail="Payment not found") from exc
        except (GatewayError, ServerError) as exc:
            raise HTTPException(status_code=502, detail="Razorpay payment API failed") from exc
        except Exception as exc:
            raise HTTPException(status_code=503, detail="Razorpay service unavailable") from exc

        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        return payment

    def _verify_signature(
        self,
        *,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> None:
        """Verify checkout signature generated by Razorpay."""
        try:
            self.client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )
        except SignatureVerificationError as exc:
            raise HTTPException(status_code=401, detail="Invalid Razorpay payment signature") from exc
        except Exception as exc:
            raise HTTPException(status_code=503, detail="Unable to verify payment signature") from exc

    def _verify_webhook_signature(self, *, payload: bytes, signature: str) -> None:
        """Verify webhook signature using configured Razorpay webhook secret."""
        try:
            self.client.utility.verify_webhook_signature(
                body=payload.decode("utf-8"),
                signature=signature,
                secret=settings.RAZORPAY_WEBHOOK_SECRET,
            )
        except SignatureVerificationError as exc:
            raise HTTPException(status_code=401, detail="Invalid Razorpay webhook signature") from exc
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc

    async def _validate_application(self, *, application_id: str) -> None:
        """Placeholder application validation until database layer is implemented."""
        if not application_id.strip():
            raise HTTPException(status_code=400, detail="Invalid application_id")

        # TODO:
        # Fetch Application from database

        # TODO:
        # Validate application state allows payment initiation/verification

    def _require_configured(self, keys: list[str]) -> None:
        missing = [key for key in keys if not getattr(settings, key)]
        if missing:
            raise HTTPException(
                status_code=503,
                detail="Razorpay is not configured. Set: " + ", ".join(missing),
            )
