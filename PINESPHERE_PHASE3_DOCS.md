# Pinesphere ERP - Phase 3: Finance & Commercial Management System

## Overview

Phase 3 introduces enterprise-grade financial management into the Pinesphere ERP. This includes fee structuring, automated billing, payment verification workflows, and an internship wallet system for tracking stipends and refunds. It strictly follows the pre-established architecture of Registry-Driven Navigation and Layered Decoupling.

## Architectural Layers

### 1. Core Registry (`src/core/features/feature-registry.ts`)
Six new modules were integrated directly into the `FEATURE_REGISTRY`:
- `payment` -> `/feature/payments`
- `fee` -> `/feature/fees`
- `billing` -> `/feature/billing`
- `wallet` -> `/feature/wallet`
- `finance` -> `/feature/finance-dashboard`
- `finance_analytics` -> `/feature/finance-analytics`

### 2. Permissions & Roles (`mock-permissions.ts`, `mock-roles.ts`)
- **New Permissions**: Over 20 granular permissions were added (e.g., `payment.verify`, `payment.refund`, `fee.create`, `wallet.view`).
- **New Role**: `Finance Manager` (code: `ROLE_FINANCE`) was introduced with full access to the financial ecosystem.
- Existing roles (Super Admin, HR, Students, Coordinators) were updated. Students and Coordinators received view-only access to their Wallets.

### 3. Data Types (`src/types/*.types.ts`)
Strict TypeScript interfaces dictate the data shapes across the financial ecosystem:
- `PaymentTransaction`: Supports UPI, Cash, Cards, and tracks GST, discounts, and fines.
- `FeeStructure`: Supports Registration, Internship, and Hostel fees with installment slabs.
- `Invoice` & `Receipt`: Connects billing items with SubTotals, Taxes, and GrandTotals.
- `WalletTransaction`: Supports Credit/Debit with specific sources like Stipend, Refund, or Cashback.
- `FinanceMetrics`: Aggregates KPI parameters like monthly revenue and pending payments.

### 4. Mock Repository (`src/data/mock-*.ts`)
To facilitate UI development without a backend, large arrays of mock data are generated dynamically:
- `MOCK_PAYMENTS`: 500 records.
- `MOCK_FEES`: 25 records.
- `MOCK_INVOICES`: 200 records.
- `MOCK_RECEIPTS`: Filtered from paid invoices.
- `MOCK_WALLET_TRANSACTIONS`: 100 records.

### 5. API Layer (`src/api/*.api.ts`)
Simulates asynchronous network calls returning `Promise<T>`. This acts as the boundary interface where `axios` or `fetch` calls will replace the mock timers in production.

### 6. Service Layer (`src/services/*.service.ts`)
Encapsulates all business logic:
- `FinanceService` orchestrates cross-domain aggregations (fetching from `PaymentService`, `BillingService`, and `WalletService` to generate global dashboard KPIs).

### 7. UI Components (`src/components/admin/*`)
Modular React components that consume Services exclusively:
- `PaymentTable`: Advanced table with transaction tracking.
- `FeeTable`: Grid view of fee slabs and amounts.
- `InvoiceViewer`: Billing grid with simulated download functionality.
- `WalletCard`: Stunning glassmorphic balance display with recent transaction ledger.
- `FinanceDashboard`: KPI cards and placeholder charts for revenue mapping.

## Next Steps / Future Roadmap
- Integrate `Chart.js` or `Recharts` into the Finance Dashboard for visual revenue mapping.
- Finalize the `FinanceAnalyticsPage` which currently acts as a placeholder for advanced forecasting.
- Replace API mock delays with real REST endpoints connecting to a Postgres/MySQL database.
- Integrate a real payment gateway (Razorpay/Stripe) into the `payment.service.ts` processing flows.
