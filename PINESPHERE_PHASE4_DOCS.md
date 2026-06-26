# Pinesphere ERP - Phase 4: Communication Platform

## Overview

Phase 4 introduces a centralized, omni-channel Communication Platform into the Pinesphere ERP. It serves as the unified hub for notifications, announcements, internal messaging, calendar scheduling, and automated email templating. The system adheres strictly to the decoupled, registry-driven architecture established in previous phases.

## Architectural Layers

### 1. Core Registry (`src/core/features/feature-registry.ts`)
Five new modules were integrated directly into the `FEATURE_REGISTRY`:
- `notification` -> `/feature/notifications` (Notification Center)
- `announcement` -> `/feature/announcements` (Announcement Management)
- `communication` -> `/feature/communication` (Communication Center)
- `calendar` -> `/feature/calendar` (Calendar & Scheduler)
- `email` -> `/feature/email` (Email & Template Management)

### 2. Permissions & Roles (`mock-permissions.ts`, `mock-roles.ts`)
- **New Permissions**: Over 25 granular permissions were added (e.g., `notification.send`, `announcement.create`, `communication.view`, `calendar.approve`, `email.edit`).
- **Role Updates**: All existing roles (Super Admin, HR, Reporting Manager, Mentor, Coordinator, Finance, Student) were updated to receive view access (`*.view`) to communication modules, while HR and Super Admin received full CRUD and export capabilities.

### 3. Dashboard Widgets (`src/core/dashboard/widget-registry.ts`)
Eight new widgets were integrated into the Widget Registry for seamless dashboard integration:
- `unread_notifications`, `todays_events`, `upcoming_interviews`, `pending_announcements`, `unread_messages`, `scheduled_notifications`, `notification_analytics`, `communication_activity`.

### 4. Data Types (`src/types/*.types.ts`)
Strict TypeScript interfaces dictate the data shapes:
- `Notification`: Supports omni-channel delivery (Email, SMS, WhatsApp, Push, In-App).
- `Announcement`: Supports multi-audience targeting and pinned flags.
- `Message` & `Conversation`: Supports One-to-One, Group, and Broadcast chat threads.
- `CalendarEvent`: Supports interviews, meetings, and recurring schedules with meeting links.
- `EmailTemplate`: Supports HTML bodies with variables (`{{userName}}`) and versioning.

### 5. Mock Repository (`src/data/mock-*.ts`)
Massive enterprise-scale mock datasets were generated to facilitate robust UI testing:
- **500+** Notifications
- **100+** Announcements
- **200+** Conversations with **3000+** Messages
- **300+** Calendar Events
- **50+** Email Templates and **500+** History Logs

### 6. API Layer (`src/api/*.api.ts`)
Asynchronous network call simulators using `Promise<T>` and simulated latency (`delay`). This isolates the UI from data fetching, enabling a seamless transition to a real backend (e.g., Node.js/Python).

### 7. Service Layer (`src/services/*.service.ts`)
Encapsulates all business logic:
- `CommunicationService`: Aggregates messages and conversations.
- `NotificationService`: Calculates delivery statistics and unread counts.
- `CalendarService`: Filters `todaysEvents` based on real-time date logic.

### 8. UI Components (`src/components/admin/*`)
Modular React components that consume Services exclusively:
- `NotificationDashboard`: Omni-channel status mapping.
- `AnnouncementDashboard`: Pinned and priority-based filtering.
- `InboxView` & `ChatWindow`: Real-time style message threads with scroll-to-bottom behavior.
- `CalendarDashboard`: Agenda views and interactive meeting links.
- `EmailDashboard`: Template version tracking and delivery statistics.

## Future Integration Roadmap
The APIs and Services are designed to support future plug-and-play integration with:
- **Email**: SMTP, Brevo, Mailgun.
- **SMS & WhatsApp**: Twilio, Meta WhatsApp Business API.
- **Push**: Firebase Cloud Messaging (FCM).
- **Calendar**: Google Calendar API, Microsoft Graph API (Outlook).
- **Messaging**: WebSockets / Socket.io for real-time `ChatWindow` updates.
