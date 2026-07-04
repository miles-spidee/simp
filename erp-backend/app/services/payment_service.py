from __future__ import annotations

import json
import logging
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
from typing import Any
from uuid import UUID

from fastapi import HTTPException
from razorpay import Client
from razorpay.errors import BadRequestError, GatewayError, ServerError, SignatureVerificationError
from sqlalchemy import String, cast, func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.config import settings
from app.models.authentication.user import User
from app.models.academic.batch import Batch
from app.models.core.reference.localization import Currency
from app.models.finance.fee import FeeStructure
from app.models.finance.invoice import Invoice, InvoiceItem
from app.models.finance.payment import PaymentTransaction
from app.models.finance.receipt import Receipt
from app.models.internships.application import Application
from app.models.profiles.student_profile import StudentProfile

logger = logging.getLogger(__name__)


class PaymentService:
    _GATEWAY_RESPONSE_LIMIT = 1000

    def __init__(self, db: AsyncSession):
        self.db = db
        self.client = Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    async def create_order(self, *, application_id: str) -> dict[str, Any]:
        """Create a Razorpay order and persist a pending payment transaction."""
        if not application_id:
            raise HTTPException(status_code=400, detail="application_id is required")

        self._require_configured(["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_CURRENCY"])

        try:
            application, student_profile = await self._validate_application(
                application_id=application_id,
                lock=True,
                enforce_payment_eligibility=True,
                reject_existing_payment=True,
            )
            user = await self.db.get(User, student_profile.user_id)
            if user is None:
                raise HTTPException(status_code=404, detail="Student user not found")
            fee = await self._resolve_application_fee(student_profile=student_profile)
            currency = await self._resolve_currency(code=settings.RAZORPAY_CURRENCY)

            existing_success = await self._find_application_transaction(
                application_id=str(application.id),
                statuses=["captured", "SUCCESS"],
            )
            if existing_success:
                raise HTTPException(status_code=409, detail="Application has already been paid")

            existing_pending = await self._find_application_transaction(
                application_id=str(application.id),
                statuses=["created", "authorized", "PENDING"],
            )
            if existing_pending:
                existing_payload = self._load_gateway_response(existing_pending.gateway_response)
                existing_order_id = str(
                    existing_payload.get("order_id") or existing_pending.transaction_id
                )
                logger.info(
                    "payment.order.reused",
                    extra={"application_id": application_id, "order_id": existing_order_id},
                )
                return {
                    "order_id": existing_order_id,
                    "amount": self._to_paise(self._to_decimal(existing_pending.amount)),
                    "currency": currency.code,
                    "status": "created",
                }

            amount_paise = self._to_paise(self._to_decimal(fee.amount))
            order = self._create_razorpay_order(
                amount=amount_paise,
                currency=currency.code,
                receipt=f"app_{application.id}",
                notes={
                    "application_id": str(application.id),
                    "student_profile_id": str(student_profile.id),
                },
            )

            transaction = PaymentTransaction(
                transaction_id=str(order.get("id")),
                user_id=user.id,
                order_id=application.id,
                razorpay_order_id=str(order.get("id")),
                razorpay_payment_id=None,
                razorpay_signature=None,
                amount=self._to_decimal(fee.amount),
                currency_id=currency.id,
                currency=currency.code,
                status="created",
                payment_method=None,
                receipt=str(order.get("receipt") or f"app_{application.id}"),
                customer_email=user.email,
                customer_contact=user.phone,
                customer_name=user.username,
                notes={
                    "application_id": str(application.id),
                    "student_profile_id": str(student_profile.id),
                },
                razorpay_created_at=self._to_datetime(order.get("created_at")),
                refund=False,
                gateway_response=self._serialize_gateway_response(
                    {
                        "application_id": str(application.id),
                        "student_profile_id": str(student_profile.id),
                        "order_id": order.get("id"),
                        "amount": order.get("amount"),
                        "currency": order.get("currency"),
                    }
                ),
            )
            self.db.add(transaction)
            await self.db.flush()
            await self.db.commit()

            logger.info(
                "payment.order.created",
                extra={"application_id": application_id, "order_id": order.get("id")},
            )
            return {
                "order_id": order.get("id"),
                "amount": order.get("amount", amount_paise),
                "currency": order.get("currency", currency.code),
                "status": order.get("status"),
            }
        except HTTPException:
            await self.db.rollback()
            raise
        except SQLAlchemyError as exc:
            await self.db.rollback()
            logger.error(
                "payment.order.db_failure",
                extra={"application_id": application_id, "error": str(exc)},
            )
            raise HTTPException(
                status_code=503, detail="Database error while creating payment order"
            ) from exc
        except Exception as exc:
            await self.db.rollback()
            logger.error(
                "payment.order.failure", extra={"application_id": application_id, "error": str(exc)}
            )
            raise HTTPException(status_code=503, detail="Unable to create payment order") from exc

    async def verify_payment(
        self,
        *,
        razorpay_payment_id: str,
        razorpay_order_id: str,
        razorpay_signature: str,
    ) -> dict[str, Any]:
        """Verify payment and persist payment/invoice/receipt updates atomically."""
        if not razorpay_payment_id or not razorpay_order_id or not razorpay_signature:
            raise HTTPException(status_code=400, detail="Payment verification fields are required")

        self._require_configured(["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"])

        try:
            self._verify_signature(
                razorpay_order_id=razorpay_order_id,
                razorpay_payment_id=razorpay_payment_id,
                razorpay_signature=razorpay_signature,
            )
            payment = self._fetch_payment(razorpay_payment_id=razorpay_payment_id)
            if str(payment.get("order_id")) != razorpay_order_id:
                raise HTTPException(
                    status_code=409, detail="Payment does not belong to the provided order"
                )

            if str(payment.get("status", "")).lower() != "captured":
                raise HTTPException(status_code=409, detail="Payment is not captured")

            transaction = await self._find_transaction_by_order_id(order_id=razorpay_order_id)
            if transaction is None:
                raise HTTPException(status_code=404, detail="Pending payment transaction not found")

            if transaction.status in {"captured", "SUCCESS"}:
                return await self._build_success_response(transaction=transaction, payment=payment)

            transaction_data = self._load_gateway_response(transaction.gateway_response)
            application_id = str(transaction_data.get("application_id") or "")
            if not application_id:
                raise HTTPException(
                    status_code=404, detail="Application mapping not found for transaction"
                )

            application, _ = await self._validate_application(application_id=application_id)
            invoice, receipt = await self._finalize_successful_payment(
                application=application,
                transaction=transaction,
                razorpay_order_id=razorpay_order_id,
                razorpay_payment_id=razorpay_payment_id,
                razorpay_signature=razorpay_signature,
                payment=payment,
            )
            await self.db.commit()

            logger.info(
                "payment.verification.success",
                extra={"order_id": razorpay_order_id, "payment_id": razorpay_payment_id},
            )
            return {
                "verified": True,
                "payment_id": razorpay_payment_id,
                "order_id": razorpay_order_id,
                "status": payment.get("status"),
                "amount": payment.get("amount"),
                "currency": payment.get("currency"),
                "invoice_number": invoice.invoice_number,
                "receipt_number": receipt.receipt_number,
            }
        except HTTPException:
            await self.db.rollback()
            raise
        except SQLAlchemyError as exc:
            await self.db.rollback()
            logger.error(
                "payment.verification.db_failure",
                extra={
                    "order_id": razorpay_order_id,
                    "payment_id": razorpay_payment_id,
                    "error": str(exc),
                },
            )
            raise HTTPException(
                status_code=503, detail="Database error during payment verification"
            ) from exc
        except Exception as exc:
            await self.db.rollback()
            logger.error(
                "payment.verification.failure",
                extra={
                    "order_id": razorpay_order_id,
                    "payment_id": razorpay_payment_id,
                    "error": str(exc),
                },
            )
            raise HTTPException(status_code=503, detail="Unable to verify payment") from exc

    async def handle_webhook(self, *, payload: bytes, signature: str | None) -> dict[str, Any]:
        """Handle Razorpay webhooks with signature verification and idempotency."""
        if not payload:
            raise HTTPException(status_code=400, detail="Webhook payload is required")
        if not signature:
            raise HTTPException(status_code=401, detail="Missing Razorpay webhook signature")

        self._require_configured(["RAZORPAY_WEBHOOK_SECRET"])

        try:
            self._verify_webhook_signature(payload=payload, signature=signature)
            event = json.loads(payload.decode("utf-8"))
            event_type = str(event.get("event", ""))
            event_payload = event.get("payload", {})

            logger.info("payment.webhook.received", extra={"event": event_type})

            if event_type not in {"payment.captured", "payment.failed", "order.paid"}:
                return {"processed": True, "event": event_type, "ignored": True}

            if event_type == "payment.failed":
                payment_entity = event_payload.get("payment", {}).get("entity", {})
                order_id = str(payment_entity.get("order_id") or "")
                payment_id = str(payment_entity.get("id") or "")

                transaction = (
                    await self._find_transaction_by_order_id(order_id=order_id)
                    if order_id
                    else None
                )
                if transaction and transaction.status not in {"captured", "SUCCESS"}:
                    transaction.status = "failed"
                    transaction.gateway_response = self._serialize_gateway_response(
                        self._merge_gateway_response(
                            transaction.gateway_response,
                            {
                                "order_id": order_id,
                                "payment_id": payment_id,
                                "status": "failed",
                                "event": event_type,
                            },
                        )
                    )
                    await self.db.commit()

                logger.info(
                    "payment.webhook.failed", extra={"order_id": order_id, "payment_id": payment_id}
                )
                return {"processed": True, "event": event_type, "payload": event_payload}

            payment_entity = event_payload.get("payment", {}).get("entity", {})
            order_entity = event_payload.get("order", {}).get("entity", {})
            order_id = str(payment_entity.get("order_id") or order_entity.get("id") or "")
            payment_id = str(payment_entity.get("id") or "")

            if not order_id or not payment_id:
                logger.info("payment.webhook.ignored", extra={"event": event_type})
                return {"processed": True, "event": event_type, "ignored": True}

            transaction = await self._find_transaction_by_order_id(order_id=order_id)
            if transaction and transaction.status in {"captured", "SUCCESS"}:
                return {"processed": True, "event": event_type, "payload": event_payload}

            payment = self._fetch_payment(razorpay_payment_id=payment_id)
            if str(payment.get("order_id")) != order_id:
                raise HTTPException(
                    status_code=409, detail="Payment does not belong to the provided order"
                )
            if str(payment.get("status", "")).lower() != "captured":
                raise HTTPException(status_code=409, detail="Payment is not captured")
            if transaction is None:
                raise HTTPException(status_code=404, detail="Pending payment transaction not found")

            application_id = str(
                self._load_gateway_response(transaction.gateway_response).get("application_id")
                or ""
            )
            if not application_id:
                raise HTTPException(
                    status_code=404, detail="Application mapping not found for transaction"
                )

            application, _ = await self._validate_application(application_id=application_id)
            await self._finalize_successful_payment(
                application=application,
                transaction=transaction,
                razorpay_order_id=order_id,
                razorpay_payment_id=payment_id,
                razorpay_signature=payment.get("signature") or "",
                payment=payment,
            )
            await self.db.commit()

            logger.info(
                "payment.webhook.success", extra={"event": event_type, "order_id": order_id}
            )
            return {"processed": True, "event": event_type, "payload": event_payload}
        except HTTPException:
            await self.db.rollback()
            logger.warning("payment.webhook.verification_failed")
            raise
        except Exception as exc:
            await self.db.rollback()
            logger.error("payment.webhook.failure", extra={"error": str(exc)})
            raise HTTPException(status_code=400, detail="Invalid Razorpay webhook payload") from exc

    async def get_payment(self, *, razorpay_payment_id: str) -> dict[str, Any]:
        """Fetch a payment from Razorpay."""
        if not razorpay_payment_id:
            raise HTTPException(status_code=400, detail="razorpay_payment_id is required")

        self._require_configured(["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"])
        return self._fetch_payment(razorpay_payment_id=razorpay_payment_id)

    async def get_application_payment(self, *, application_id: str) -> dict[str, Any]:
        """Return payment, invoice, and receipt details for an application."""
        if not application_id:
            raise HTTPException(status_code=400, detail="application_id is required")

        application, _ = await self._validate_application(application_id=application_id)
        transaction = await self._find_application_transaction(
            application_id=str(application.id),
            statuses=[
                "captured",
                "created",
                "authorized",
                "failed",
                "refunded",
                "SUCCESS",
                "PENDING",
                "FAILED",
            ],
        )
        if not transaction:
            raise HTTPException(status_code=404, detail="Application payment details not found")

        invoice = await self._find_invoice_by_application(application_id=str(application.id))
        receipt = await self._find_receipt_for_transaction(transaction=transaction)

        payload = self._load_gateway_response(transaction.gateway_response)
        return {
            "application_id": str(application.id),
            "transaction": {
                "transaction_id": transaction.transaction_id,
                "status": transaction.status,
                "amount": self._to_decimal(transaction.amount),
                "currency": payload.get("currency"),
                "order_id": payload.get("order_id"),
                "payment_id": payload.get("payment_id"),
            },
            "invoice": (
                {
                    "invoice_number": invoice.invoice_number,
                    "payment_status": invoice.payment_status,
                    "grand_total": self._to_decimal(invoice.grand_total),
                }
                if invoice
                else None
            ),
            "receipt": (
                {
                    "receipt_number": receipt.receipt_number,
                    "amount_paid": self._to_decimal(receipt.amount_paid),
                    "payment_method": receipt.payment_method,
                    "payment_date": receipt.payment_date.isoformat(),
                    "transaction_id": receipt.transaction_id,
                }
                if receipt
                else None
            ),
        }

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
            raise HTTPException(
                status_code=401, detail="Invalid Razorpay payment signature"
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=503, detail="Unable to verify payment signature"
            ) from exc

    def _verify_webhook_signature(self, *, payload: bytes, signature: str) -> None:
        """Verify webhook signature using configured Razorpay webhook secret."""
        try:
            self.client.utility.verify_webhook_signature(
                body=payload.decode("utf-8"),
                signature=signature,
                secret=settings.RAZORPAY_WEBHOOK_SECRET,
            )
        except SignatureVerificationError as exc:
            raise HTTPException(
                status_code=401, detail="Invalid Razorpay webhook signature"
            ) from exc
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc

    async def _validate_application(
        self,
        *,
        application_id: str,
        lock: bool = False,
        enforce_payment_eligibility: bool = False,
        reject_existing_payment: bool = False,
    ) -> tuple[Application, StudentProfile]:
        """Validate application, student profile linkage, and payment eligibility.

        The current schema does not expose a direct payment/application foreign key, so the
        service uses the application id as the stable lookup anchor and stores the application
        mapping in gateway_response metadata.
        """
        if not application_id.strip():
            raise HTTPException(status_code=400, detail="Invalid application_id")

        try:
            application_uuid = UUID(application_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Invalid application_id") from exc

        stmt = (
            select(Application)
            .options(joinedload(Application.opportunity))
            .where(Application.id == application_uuid, Application.deleted_at.is_(None))
        )
        if lock:
            stmt = stmt.with_for_update()

        result = await self.db.execute(stmt)
        application = result.scalars().first()
        if application is None:
            raise HTTPException(status_code=404, detail="Application not found")

        if application.opportunity is None:
            raise HTTPException(status_code=404, detail="Application opportunity not found")

        student_profile = await self.db.get(StudentProfile, application.student_profile_id)
        if student_profile is None:
            raise HTTPException(status_code=404, detail="Student profile not found")

        if application.opportunity.status != "OPEN" and not lock:
            # Assumption: OPEN is the only explicitly eligible internship opportunity state in the current model.
            raise HTTPException(status_code=409, detail="Application is not eligible for payment")

        if not lock:
            existing_success = await self._find_application_transaction(
                application_id=str(application.id),
                statuses=["captured", "SUCCESS"],
            )
            if existing_success:
                raise HTTPException(status_code=409, detail="Application is already paid")

        return application, student_profile

    async def _resolve_application_fee(self, *, student_profile: StudentProfile) -> FeeStructure:
        """Resolve fee from student's batch/program linked fee structure."""
        if student_profile.batch_id is None:
            raise HTTPException(
                status_code=404, detail="Student batch not found for fee calculation"
            )

        batch = await self.db.get(Batch, student_profile.batch_id)
        if batch is None:
            raise HTTPException(status_code=404, detail="Batch not found for fee calculation")

        fee_stmt = (
            select(FeeStructure)
            .where(
                FeeStructure.deleted_at.is_(None),
                (FeeStructure.batch_id == batch.id) | (FeeStructure.program_id == batch.program_id),
            )
            .order_by(FeeStructure.batch_id.is_(None), FeeStructure.created_at.desc())
        )
        fee_result = await self.db.execute(fee_stmt)
        fee = fee_result.scalars().first()
        if fee is None:
            raise HTTPException(status_code=404, detail="Fee structure not found")

        if self._to_decimal(fee.amount) <= Decimal("0"):
            raise HTTPException(status_code=409, detail="Invalid fee amount configured")
        return fee

    async def _resolve_currency(self, *, code: str) -> Currency:
        """Resolve active currency by ISO code."""
        stmt = select(Currency).where(
            func.upper(Currency.code) == code.upper(),
            Currency.is_active.is_(True),
            Currency.deleted_at.is_(None),
        )
        result = await self.db.execute(stmt)
        currency = result.scalars().first()
        if currency is None:
            raise HTTPException(status_code=404, detail=f"Active currency {code} not found")
        return currency

    async def _find_application_transaction(
        self, *, application_id: str, statuses: list[str]
    ) -> PaymentTransaction | None:
        """Find latest transaction for an application from stored gateway metadata."""
        like_value = f'%"application_id":"{application_id}"%'
        stmt = (
            select(PaymentTransaction)
            .where(
                PaymentTransaction.deleted_at.is_(None),
                PaymentTransaction.status.in_(statuses),
                cast(PaymentTransaction.gateway_response, String).ilike(like_value),
            )
            .order_by(PaymentTransaction.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def _find_transaction_by_order_id(self, *, order_id: str) -> PaymentTransaction | None:
        """Locate transaction by order id from transaction id or stored gateway metadata."""
        by_transaction_stmt = (
            select(PaymentTransaction)
            .where(
                PaymentTransaction.deleted_at.is_(None),
                PaymentTransaction.transaction_id == order_id,
            )
            .order_by(PaymentTransaction.created_at.desc())
        )
        by_transaction_result = await self.db.execute(by_transaction_stmt)
        by_transaction = by_transaction_result.scalars().first()
        if by_transaction:
            return by_transaction

        like_value = f'%"order_id":"{order_id}"%'
        by_payload_stmt = (
            select(PaymentTransaction)
            .where(
                PaymentTransaction.deleted_at.is_(None),
                cast(PaymentTransaction.gateway_response, String).ilike(like_value),
            )
            .order_by(PaymentTransaction.created_at.desc())
        )
        by_payload_result = await self.db.execute(by_payload_stmt)
        return by_payload_result.scalars().first()

    async def _get_or_create_invoice(self, *, application: Application, amount: Decimal) -> Invoice:
        """Create invoice idempotently for an application."""
        invoice_number = self._invoice_number(application_id=str(application.id))
        stmt = (
            select(Invoice)
            .where(
                Invoice.deleted_at.is_(None),
                Invoice.invoice_number == invoice_number,
            )
            .options(joinedload(Invoice.items))
        )
        result = await self.db.execute(stmt)
        invoice = result.scalars().first()
        if invoice:
            if invoice.payment_status != "PAID":
                invoice.payment_status = "PAID"
            if not invoice.items:
                self.db.add(
                    InvoiceItem(
                        invoice_id=invoice.id,
                        description="Internship application fee",
                        amount=amount,
                    )
                )
            return invoice

        issue_date = date.today()
        invoice = Invoice(
            invoice_number=invoice_number,
            student_profile_id=application.student_profile_id,
            company_id=application.opportunity.company_id,
            sub_total=amount,
            tax_amount=Decimal("0.00"),
            discount=Decimal("0.00"),
            grand_total=amount,
            payment_status="PAID",
            issue_date=issue_date,
            due_date=issue_date + timedelta(days=7),
        )
        self.db.add(invoice)
        await self.db.flush()

        self.db.add(
            InvoiceItem(
                invoice_id=invoice.id,
                description="Internship application fee",
                amount=amount,
            )
        )
        return invoice

    async def _get_or_create_receipt(
        self,
        *,
        invoice: Invoice,
        amount: Decimal,
        payment_method: str,
        transaction_id: str,
    ) -> Receipt:
        """Create receipt idempotently for a successful payment."""
        receipt_number = self._receipt_number(transaction_id=transaction_id)
        stmt = select(Receipt).where(
            Receipt.deleted_at.is_(None),
            Receipt.receipt_number == receipt_number,
        )
        result = await self.db.execute(stmt)
        existing = result.scalars().first()
        if existing:
            return existing

        receipt = Receipt(
            receipt_number=receipt_number,
            invoice_id=invoice.id,
            amount_paid=amount,
            payment_method=payment_method.upper(),
            payment_date=datetime.now(timezone.utc),
            transaction_id=transaction_id,
        )
        self.db.add(receipt)
        await self.db.flush()
        return receipt

    async def _find_invoice_by_application(self, *, application_id: str) -> Invoice | None:
        stmt = select(Invoice).where(
            Invoice.deleted_at.is_(None),
            Invoice.invoice_number == self._invoice_number(application_id=application_id),
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def _find_receipt_for_transaction(
        self, *, transaction: PaymentTransaction
    ) -> Receipt | None:
        payload = self._load_gateway_response(transaction.gateway_response)
        payment_id = str(payload.get("payment_id") or "")
        if payment_id:
            by_payment_stmt = select(Receipt).where(
                Receipt.deleted_at.is_(None),
                Receipt.transaction_id == payment_id,
            )
            by_payment_result = await self.db.execute(by_payment_stmt)
            by_payment = by_payment_result.scalars().first()
            if by_payment:
                return by_payment

        by_receipt_number_stmt = select(Receipt).where(
            Receipt.deleted_at.is_(None),
            Receipt.receipt_number
            == self._receipt_number(transaction_id=transaction.transaction_id),
        )
        by_receipt_number_result = await self.db.execute(by_receipt_number_stmt)
        return by_receipt_number_result.scalars().first()

    def _invoice_number(self, *, application_id: str) -> str:
        return f"INV-{application_id}"

    def _receipt_number(self, *, transaction_id: str) -> str:
        return f"RCP-{transaction_id}"

    def _to_decimal(self, value: Any) -> Decimal:
        return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    def _to_paise(self, amount_rupees: Decimal) -> int:
        return int((amount_rupees * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

    def _to_datetime(self, value: Any) -> datetime | None:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value
        try:
            if isinstance(value, (int, float)):
                return datetime.fromtimestamp(value, tz=timezone.utc)
            if isinstance(value, str):
                try:
                    return datetime.fromtimestamp(float(value), tz=timezone.utc)
                except ValueError:
                    parsed = datetime.fromisoformat(value)
                    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
        except Exception:
            return None
        return None

    def _serialize_gateway_response(self, payload: dict[str, Any]) -> str:
        encoded = json.dumps(payload, separators=(",", ":"), default=str)
        if len(encoded) <= self._GATEWAY_RESPONSE_LIMIT:
            return encoded

        compact_payload = self._compact_gateway_response(payload)
        compact_encoded = json.dumps(compact_payload, separators=(",", ":"), default=str)
        if len(compact_encoded) <= self._GATEWAY_RESPONSE_LIMIT:
            return compact_encoded

        # Database limitation: fin_payment_transactions.gateway_response is limited to 1000 chars.
        # Do not truncate JSON silently; fail closed so the schema can be widened later if needed.
        raise HTTPException(status_code=503, detail="Gateway response exceeds storage limit")

    def _compact_gateway_response(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {
            key: payload.get(key)
            for key in (
                "application_id",
                "student_profile_id",
                "order_id",
                "payment_id",
                "status",
                "amount",
                "currency",
                "method",
                "event",
            )
            if payload.get(key) is not None
        }

    def _merge_gateway_response(
        self, existing_payload: str | None, updates: dict[str, Any]
    ) -> dict[str, Any]:
        merged = self._load_gateway_response(existing_payload)
        merged.update({key: value for key, value in updates.items() if value is not None})
        return self._compact_gateway_response(merged)

    def _load_gateway_response(self, payload: str | None) -> dict[str, Any]:
        if not payload:
            return {}
        try:
            value = json.loads(payload)
            if isinstance(value, dict):
                return value
            return {}
        except json.JSONDecodeError:
            return {}

    async def _finalize_successful_payment(
        self,
        *,
        application: Application,
        transaction: PaymentTransaction,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
        payment: dict[str, Any],
    ) -> tuple[Invoice, Receipt]:
        amount = self._to_decimal(transaction.amount)
        if int(payment.get("amount", 0)) != self._to_paise(amount):
            raise HTTPException(status_code=409, detail="Payment amount mismatch")

        currency = await self.db.get(Currency, transaction.currency_id)
        if not currency:
            raise HTTPException(status_code=404, detail="Transaction currency not found")
        if str(payment.get("currency", "")).upper() != currency.code.upper():
            raise HTTPException(status_code=409, detail="Payment currency mismatch")

        transaction.status = "captured"
        transaction.razorpay_order_id = razorpay_order_id
        transaction.razorpay_payment_id = razorpay_payment_id
        transaction.razorpay_signature = razorpay_signature
        transaction.payment_method = str(payment.get("method") or "razorpay")
        transaction.razorpay_created_at = self._to_datetime(payment.get("created_at"))
        transaction.gateway_response = self._serialize_gateway_response(
            {
                **self._load_gateway_response(transaction.gateway_response),
                "application_id": str(application.id),
                "order_id": razorpay_order_id,
                "payment_id": razorpay_payment_id,
                "status": payment.get("status"),
                "amount": payment.get("amount"),
                "currency": payment.get("currency"),
                "method": payment.get("method"),
            }
        )

        invoice = await self._get_or_create_invoice(application=application, amount=amount)
        receipt = await self._get_or_create_receipt(
            invoice=invoice,
            amount=amount,
            payment_method=str(payment.get("method") or "RAZORPAY"),
            transaction_id=razorpay_payment_id,
        )

        if application.status == "PENDING":
            # Assumption: OPEN is the only explicitly documented internship opportunity state that permits payment.
            application.status = "UNDER_REVIEW"

        # Send Payment Success notification (Email, SMS, In-App)
        try:
            from app.models.authentication.user import User as DBUser
            from app.models.profiles.student_profile import StudentProfile
            from app.services.notification_service import notification_service
            
            user_stmt = select(DBUser).join(StudentProfile, StudentProfile.user_id == DBUser.id).where(StudentProfile.id == application.student_profile_id)
            user_res = await self.db.execute(user_stmt)
            user_obj = user_res.scalars().first()
            
            if user_obj:
                await notification_service.send_payment_success(
                    username=user_obj.username.title(),
                    email=user_obj.email,
                    phone=user_obj.phone or "+919876543210",
                    amount=str(amount),
                    tx_id=razorpay_payment_id
                )
        except Exception as e:
            print("Error sending payment success notification:", e)

        return invoice, receipt

    async def _build_success_response(
        self,
        *,
        transaction: PaymentTransaction,
        payment: dict[str, Any],
    ) -> dict[str, Any]:
        payload = self._load_gateway_response(transaction.gateway_response)
        invoice = await self._find_invoice_by_application(
            application_id=str(payload.get("application_id") or "")
        )
        receipt = await self._find_receipt_for_transaction(transaction=transaction)
        response: dict[str, Any] = {
            "verified": True,
            "payment_id": str(
                payment.get("id") or payload.get("payment_id") or transaction.transaction_id
            ),
            "order_id": str(
                payment.get("order_id") or payload.get("order_id") or transaction.transaction_id
            ),
            "status": payment.get("status"),
            "amount": payment.get("amount"),
            "currency": payment.get("currency"),
        }
        if invoice:
            response["invoice_number"] = invoice.invoice_number
        if receipt:
            response["receipt_number"] = receipt.receipt_number
        return response

    def _require_configured(self, keys: list[str]) -> None:
        missing = [key for key in keys if not getattr(settings, key)]

        if missing:
            raise HTTPException(
                status_code=503,
                detail="Razorpay is not configured. Missing settings: " + ", ".join(missing),
            )
