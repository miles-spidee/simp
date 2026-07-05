from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Query, status

from app.core.database import DBSession
from app.modules.billing.schemas import (
    BillingDashboardResponse,
    InvoiceCreate,
    InvoiceDetailResponse,
    InvoiceResponse,
    InvoiceUpdate,
    PaginatedInvoiceResponse,
    PaginatedPaymentStatusResponse,
    PaginatedReceiptResponse,
    ReceiptResponse,
)
from app.modules.billing.service import BillingService

router = APIRouter()


@router.get("/dashboard", response_model=BillingDashboardResponse)
async def get_billing_dashboard(db: DBSession):
    return await BillingService(db).get_dashboard()


@router.get("/invoices", response_model=PaginatedInvoiceResponse)
async def get_invoices(
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    status: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    payment_status: Optional[str] = None,
    organization_id: Optional[UUID] = None,
    program_id: Optional[UUID] = None,
    batch_id: Optional[UUID] = None,
):
    return await BillingService(db).get_invoices(
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        status=status,
        payment_status=payment_status,
        date_from=date_from,
        date_to=date_to,
        organization_id=organization_id,
    )


@router.get("/invoice/{id}", response_model=InvoiceDetailResponse)
async def get_invoice(id: UUID, db: DBSession):
    return await BillingService(db).get_invoice_detail(id)


@router.post("/invoice", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(data: InvoiceCreate, db: DBSession):
    return await BillingService(db).create_invoice(data)


@router.put("/invoice/{id}", response_model=InvoiceResponse)
async def update_invoice(id: UUID, data: InvoiceUpdate, db: DBSession):
    return await BillingService(db).update_invoice(id, data)


@router.get("/receipts", response_model=PaginatedReceiptResponse)
async def get_receipts(
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
):
    return await BillingService(db).get_receipts(
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/receipt/{id}", response_model=ReceiptResponse)
async def get_receipt(id: UUID, db: DBSession):
    return await BillingService(db).get_receipt(id)


@router.get("/payment-status", response_model=PaginatedPaymentStatusResponse)
async def get_payment_status(
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
):
    return await BillingService(db).get_payment_status(
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
    )


# TODO: Implement POST /billing/invoice/send when the notification workflow is finalized.
# TODO: Implement POST /billing/invoice/bulk when bulk invoice generation rules are finalized.
# TODO: Implement POST /billing/invoice/cancel when invoice cancellation rules are finalized.
# TODO: Implement POST /billing/refund when refund approval and gateway reversal rules are finalized.
# TODO: Implement GET /billing/export when export format requirements are finalized.
