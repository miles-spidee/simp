from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.responses import APIResponse, success_response
from app.models.authentication.user import User

from app.modules.payment.schemas import (
    CreateOrderRequest,
    CreateOrderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    WebhookResponse,
    PaymentDetailsResponse,
)

from app.services.payment_service import PaymentService

router = APIRouter()


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