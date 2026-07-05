from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.responses import APIResponse, success_response
from app.models.authentication.user import User

from app.modules.billing.schemas import ReceiptResponse
from app.modules.payment.schemas import (
    CreateOrderRequest,
    CreateOrderResponse,
    ManualPaymentRequest,
    PaginatedPaymentReconciliationResponse,
    PaginatedPaymentResponse,
    PaymentDashboardResponse,
    PaymentDetailResponse,
    PaymentDetailsResponse,
    PaymentExportResponse,
    PaymentRefundRequest,
    PaymentRefundResponse,
    PaymentReminderRequest,
    PaymentReminderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    WebhookResponse,
)
from app.modules.payment.service import PaymentCollectionService
from app.services.payment_service import PaymentService

router = APIRouter()


# ====================================================================
# Legacy Razorpay APIs (Do NOT remove or modify their behavior)
# ====================================================================

@router.post(
    "/create-order",
    response_model=APIResponse[CreateOrderResponse],
)
async def create_order(
    data: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)

    result = await service.create_order(
        application_id=str(data.application_id),
    )

    response = CreateOrderResponse(**result)

    return success_response(
        data=response,
        message="Payment order created successfully",
    )


@router.post(
    "/verify",
    response_model=APIResponse[VerifyPaymentResponse],
)
async def verify_payment(
    data: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)

    result = await service.verify_payment(
        razorpay_payment_id=data.razorpay_payment_id,
        razorpay_order_id=data.razorpay_order_id,
        razorpay_signature=data.razorpay_signature,
    )

    response = VerifyPaymentResponse(**result)

    return success_response(
        data=response,
        message="Payment verified successfully",
    )


@router.post(
    "/webhook",
    response_model=APIResponse[WebhookResponse],
)
async def razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_razorpay_signature: Optional[str] = Header(default=None),
):
    payload = await request.body()

    service = PaymentService(db)

    result = await service.handle_webhook(
        payload=payload,
        signature=x_razorpay_signature,
    )

    response = WebhookResponse(**result)

    return success_response(
        data=response,
        message="Webhook processed successfully",
    )


@router.get(
    "/application/{application_id}",
    response_model=APIResponse[PaymentDetailsResponse],
)
async def get_application_payment(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)

    result = await service.get_application_payment(
        application_id=application_id,
    )

    response = PaymentDetailsResponse(**result)

    return success_response(
        data=response,
        message="Application payment fetched successfully",
    )


# ====================================================================
# Payment Collection Management APIs
# ====================================================================

@router.get(
    "/dashboard",
    response_model=APIResponse[PaymentDashboardResponse],
)
async def get_payment_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.get_dashboard()
    return success_response(
        data=result,
        message="Payment dashboard stats fetched successfully",
    )


@router.get(
    "/",
    response_model=APIResponse[PaginatedPaymentResponse],
)
async def get_payments(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    status: Optional[str] = Query(None),
    payment_method: Optional[str] = Query(None),
    gateway: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    organization_id: Optional[UUID] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.get_payments(
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        status=status,
        payment_method=payment_method,
        gateway=gateway,
        date_from=date_from,
        date_to=date_to,
        organization_id=organization_id,
    )
    return success_response(
        data=result,
        message="Payments fetched successfully",
    )


@router.get(
    "/history",
    response_model=APIResponse[PaginatedPaymentResponse],
)
async def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    status: Optional[str] = Query(None),
    payment_method: Optional[str] = Query(None),
    gateway: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    organization_id: Optional[UUID] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.get_history(
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        status=status,
        payment_method=payment_method,
        gateway=gateway,
        date_from=date_from,
        date_to=date_to,
        organization_id=organization_id,
    )
    return success_response(
        data=result,
        message="Payment history fetched successfully",
    )


@router.get(
    "/receipt/{receipt_id}",
    response_model=APIResponse[ReceiptResponse],
)
async def get_receipt(
    receipt_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.get_receipt(receipt_id)
    return success_response(
        data=result,
        message="Receipt fetched successfully",
    )


@router.get(
    "/reconciliation",
    response_model=APIResponse[PaginatedPaymentReconciliationResponse],
)
async def get_reconciliation(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.get_reconciliation(
        page=page,
        page_size=page_size,
        status=status,
    )
    return success_response(
        data=result,
        message="Payment reconciliations fetched successfully",
    )


@router.get(
    "/export",
    response_model=APIResponse[PaymentExportResponse],
)
async def export_payments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.export_payments()
    return success_response(
        data=result,
        message="Payments exported successfully",
    )


@router.post(
    "/manual",
    response_model=APIResponse[PaymentDetailResponse],
)
async def create_manual_payment(
    data: ManualPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.create_manual_payment(data)
    return success_response(
        data=result,
        message="Manual payment created successfully",
    )


@router.post(
    "/refund",
    response_model=APIResponse[PaymentRefundResponse],
)
async def refund_payment(
    data: PaymentRefundRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.refund_payment(data)
    return success_response(
        data=result,
        message="Refund processed successfully",
    )


@router.post(
    "/reminder",
    response_model=APIResponse[PaymentReminderResponse],
)
async def send_reminder(
    data: PaymentReminderRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentCollectionService(db)
    result = await service.send_reminder(data)
    return success_response(
        data=result,
        message="Payment reminder sent successfully",
    )


@router.get(
    "/{payment_id}",
    response_model=APIResponse[dict],
)
async def get_payment(
    payment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)

    result = await service.get_payment(
        razorpay_payment_id=payment_id,
    )

    return success_response(
        data=result,
        message="Payment fetched successfully",
    )