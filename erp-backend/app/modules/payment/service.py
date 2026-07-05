from datetime import date, datetime, timezone
from decimal import Decimal
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.finance.receipt import Receipt
from app.modules.payment.repository import PaymentRepository
from app.modules.payment.schemas import (
    ManualPaymentRequest,
    PaginatedPaymentResponse,
    PaginatedPaymentReconciliationResponse,
    PaymentDashboardResponse,
    PaymentDetailResponse,
    PaymentExportResponse,
    PaymentRefundRequest,
    PaymentRefundResponse,
    PaymentReminderRequest,
    PaymentReminderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
)
from app.services.payment_service import PaymentService as RazorpayPaymentService


MANUAL_PAYMENT_METHODS = {
    "CASH",
    "CHEQUE",
    "DD",
    "NEFT",
    "RTGS",
    "BANK_TRANSFER",
    "MANUAL_UPI",
}


class PaymentCollectionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = PaymentRepository(db)
        self.razorpay_service = RazorpayPaymentService(db)

    async def get_dashboard(self) -> PaymentDashboardResponse:
        (
            today_collection,
            monthly_collection,
            successful_payments,
            failed_payments,
            pending_payments,
            total_payments,
        ) = await self.repository.get_dashboard_totals()
        outstanding_amount = await self.repository.get_outstanding_amount()
        refund_requests = await self.repository.get_refund_request_count()
        recent_transactions = await self.repository.get_recent_transactions()

        success_rate = 0
        if total_payments:
            success_rate = float((successful_payments / total_payments) * 100)

        return PaymentDashboardResponse(
            today_collection=today_collection,
            monthly_collection=monthly_collection,
            successful_payments=successful_payments,
            failed_payments=failed_payments,
            pending_payments=pending_payments,
            outstanding_amount=outstanding_amount,
            refund_requests=refund_requests,
            success_rate=success_rate,
            recent_transactions=recent_transactions,
        )

    async def get_payments(self, **kwargs) -> PaginatedPaymentResponse:
        payments, total = await self.repository.get_payments(**kwargs)

        return PaginatedPaymentResponse(
            items=payments,
            total=total or 0,
            page=kwargs["page"],
            page_size=kwargs["page_size"],
        )

    async def get_payment_detail(self, payment_id) -> PaymentDetailResponse:
        payment = await self.repository.get_payment_detail(payment_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")

        receipt = None
        invoice = None
        if payment.razorpay_payment_id:
            receipt = await self.repository.get_receipt_by_transaction_id(payment.razorpay_payment_id)
        if not receipt and payment.receipt:
            receipt = await self.repository.get_receipt_by_number(payment.receipt)
        if receipt and receipt.invoice_id:
            invoice = await self.repository.get_invoice_by_id(receipt.invoice_id)

        refund_information = []
        if invoice:
            refund_information = await self.repository.get_refund_requests_by_invoice(invoice.id)

        return PaymentDetailResponse(
            payment_transaction=payment,
            invoice=invoice,
            receipt=receipt,
            gateway_logs=payment.gateway_logs,
            payment_logs=payment.payment_logs,
            reconciliation=payment.reconciliations,
            refund_information=refund_information,
        )

    async def get_history(self, **kwargs) -> PaginatedPaymentResponse:
        return await self.get_payments(**kwargs)

    async def get_receipt(self, receipt_id):
        receipt = await self.repository.get_receipt_by_id(receipt_id)
        if not receipt:
            raise HTTPException(status_code=404, detail="Receipt not found")
        return receipt

    async def get_reconciliation(self, **kwargs) -> PaginatedPaymentReconciliationResponse:
        rows, total = await self.repository.get_reconciliation(**kwargs)

        return PaginatedPaymentReconciliationResponse(
            items=rows,
            total=total or 0,
            page=kwargs["page"],
            page_size=kwargs["page_size"],
        )

    async def export_payments(self) -> PaymentExportResponse:
        payments, total = await self.repository.get_payments(
            page=1,
            page_size=1000,
            search=None,
            sort_by="created_at",
            sort_order="desc",
            status=None,
            payment_method=None,
            gateway=None,
            date_from=None,
            date_to=None,
            organization_id=None,
        )
        return PaymentExportResponse(items=payments, total=total or 0)

    async def create_manual_payment(self, data: ManualPaymentRequest):
        method = data.payment_method.upper()
        if method not in MANUAL_PAYMENT_METHODS:
            raise HTTPException(status_code=400, detail="Unsupported manual payment method")
        if data.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than zero")

        invoice = await self.repository.get_invoice_by_id(data.invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")

        transaction_id = data.transaction_id or f"MANUAL-{uuid4()}"
        transaction = await self.repository.create_payment_transaction(
            {
                "transaction_id": transaction_id,
                "amount": data.amount,
                "currency": data.currency,
                "status": "captured",
                "payment_method": method,
                "receipt": f"RCP-{transaction_id}",
                "customer_email": data.customer_email,
                "customer_contact": data.customer_contact,
                "customer_name": data.customer_name,
                "refund": False,
                "gateway_response": None,
            }
        )

        invoice.payment_status = "PAID" if Decimal(str(data.amount)) >= Decimal(str(invoice.grand_total)) else "PARTIAL"
        receipt = await self.razorpay_service._get_or_create_receipt(
            invoice=invoice,
            amount=data.amount,
            payment_method=method,
            transaction_id=transaction_id,
        )
        transaction.receipt = receipt.receipt_number

        await self.repository.create_payment_log(
            {
                "payment_transaction_id": transaction.id,
                "event": "MANUAL_PAYMENT_RECORDED",
                "details": {
                    "invoice_id": str(invoice.id),
                    "payment_method": method,
                    "amount": str(data.amount),
                },
                "performed_by": data.performed_by,
            }
        )
        await self.db.commit()

        return await self.get_payment_detail(transaction.id)

    async def verify_payment(self, data: VerifyPaymentRequest) -> VerifyPaymentResponse:
        result = await self.razorpay_service.verify_payment(
            razorpay_payment_id=data.razorpay_payment_id,
            razorpay_order_id=data.razorpay_order_id,
            razorpay_signature=data.razorpay_signature,
        )
        payment = await self.repository.get_payments(
            page=1,
            page_size=1,
            search=data.razorpay_payment_id,
            sort_by="created_at",
            sort_order="desc",
            status=None,
            payment_method=None,
            gateway=None,
            date_from=None,
            date_to=None,
            organization_id=None,
        )
        transactions = payment[0]
        if transactions:
            transaction = transactions[0]
            await self.repository.create_payment_log(
                {
                    "payment_transaction_id": transaction.id,
                    "event": "CAPTURED",
                    "details": result,
                    "performed_by": None,
                }
            )
            await self.repository.create_gateway_log(
                {
                    "payment_transaction_id": transaction.id,
                    "event_type": "PAYMENT_VERIFIED",
                    "request_payload": data.model_dump(),
                    "response_payload": result,
                    "http_status_code": 200,
                    "is_reconciled": False,
                }
            )
            await self.db.commit()

        return VerifyPaymentResponse(**result)

    async def refund_payment(self, data: PaymentRefundRequest) -> PaymentRefundResponse:
        payment = await self.repository.get_payment_detail(data.payment_transaction_id)
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        if data.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than zero")

        invoice = await self.repository.get_invoice_by_id(data.invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")

        refund_request = await self.repository.create_refund_request(
            {
                "invoice_id": invoice.id,
                "requested_by": data.requested_by,
                "amount": data.amount,
                "reason": data.reason,
                "status": "APPROVED",
                "reviewed_by": data.reviewed_by,
                "reviewed_at": datetime.now(timezone.utc),
            }
        )
        refund_transaction = await self.repository.create_refund_transaction(
            {
                "refund_request_id": refund_request.id,
                "refund_amount": data.amount,
                "refund_method": data.refund_method,
                "transaction_reference": data.transaction_reference,
                "refunded_at": datetime.now(timezone.utc),
            }
        )

        wallet_refund = None
        if data.wallet_id:
            wallet_refund = await self.repository.create_wallet_refund(
                {
                    "wallet_id": data.wallet_id,
                    "refund_amount": data.amount,
                    "reason": data.reason,
                    "source_transaction_id": refund_transaction.id,
                    "status": "COMPLETED",
                }
            )

        payment.refund = True
        await self.repository.create_payment_log(
            {
                "payment_transaction_id": payment.id,
                "event": "REFUNDED",
                "details": {
                    "refund_request_id": str(refund_request.id),
                    "refund_transaction_id": str(refund_transaction.id),
                    "amount": str(data.amount),
                },
                "performed_by": data.reviewed_by,
            }
        )
        await self.repository.create_gateway_log(
            {
                "payment_transaction_id": payment.id,
                "event_type": "REFUND_RECORDED",
                "request_payload": data.model_dump(),
                "response_payload": {"refund_transaction_id": str(refund_transaction.id)},
                "http_status_code": 200,
                "is_reconciled": False,
            }
        )
        await self.db.commit()

        return PaymentRefundResponse(
            refund_request=refund_request,
            refund_transaction=refund_transaction,
            wallet_refund=wallet_refund,
        )

    async def send_reminder(self, data: PaymentReminderRequest) -> PaymentReminderResponse:
        invoice = await self.repository.get_invoice_by_id(data.invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")

        return PaymentReminderResponse(
            invoice_id=invoice.id,
            reminder_type=data.reminder_type,
            channel=data.channel,
            status="PENDING",
        )
