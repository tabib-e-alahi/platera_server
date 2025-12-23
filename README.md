# Platera API — Multi-Vendor Food Delivery Backend

A modular Express.js, Prisma, and PostgreSQL backend for Platera, a Bangladesh-focused multi-vendor food delivery platform with customer ordering, provider operations, admin approval, SSLCommerz payments, settlements, and role-based authentication.

> **Connected Repository:** This backend powers the Platera frontend application.  
> **Frontend Repository:** [**Click Here**](https://github.com/tabib-e-alahi/platera_client) 
> **Frontend Live API:** [**Click Here**](https://platera-client-side.vercel.app)

---

## Problem Statement

A multi-vendor food delivery system needs more than basic CRUD APIs. It must handle customers, providers, admins, approval workflows, cart rules, city-based ordering restrictions, secure authentication, payment verification, provider revenue sharing, order status tracking, reviews, and operational settlement flows.

The backend challenge for Platera is to create a structured API that can support both customer-facing food ordering and internal marketplace operations without mixing business logic across routes.

---

## Solution Overview

Platera API is a modular backend built with Express.js, TypeScript, Prisma, and PostgreSQL. It separates business domains into focused modules such as auth, public browsing, customers, providers, meals, cart, orders, payments, reviews, support, and admin operations.

The backend supports:

- Session-based authentication through Better Auth.
- Customer, provider, admin, and super-admin roles.
- Email verification with OTP.
- Google OAuth support through Better Auth.
- Provider profile creation and admin approval workflow.
- Meal/menu management with Cloudinary image uploads.
- Cart validation, single-provider cart rule, and same-city ordering rule.
- Order creation with Cash on Delivery and online payment support.
- SSLCommerz payment initiation, validation, callbacks, IPN handling, and payment status.
- Platform fee calculation and provider earning settlement.
- Real-time order tracking through Server-Sent Events.
- Review system for delivered orders.
- Admin dashboard, user management, provider management, category management, payments, settlements, and support messages.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | Better Auth, session cookies, Google OAuth, email OTP |
| Validation | Zod |
| Uploads | Multer, Cloudinary, Sharp |
| Payment | SSLCommerz |
| Email | Nodemailer, Resend-ready config |
| Error Handling | Centralized custom errors and global error middleware |
| Build | tsup, tsx |
| Deployment | Vercel serverless entry supported through `src/vercel.ts` |
| Package Manager | pnpm |

---

## Key Features

### Authentication & Authorization

- Customer registration.
- Provider registration.
- Login and logout.
- Email verification with OTP.
- Session check endpoint for frontend route guards.
- Better Auth integration with Prisma adapter.
- Google OAuth provider support.
- Role-based access control for `CUSTOMER`, `PROVIDER`, `ADMIN`, and `SUPER_ADMIN`.
- Admin guard and provider guard middleware.
- User status support with `ACTIVE` and `SUSPENDED` states.

### Public Marketplace APIs

- Get active food categories.
- Get homepage hero statistics.
- Get featured restaurants/providers.
- Browse restaurants with filters.
- Get restaurant details with meals and filters.
- Get top dishes.
- Get homepage testimonials.

### Customer APIs

- Create and update customer profile.
- Store city and delivery address information.
- Cart creation and management.
- Add item, update quantity, remove item, and clear cart.
- Same-city ordering validation between customer and provider.
- Checkout preview before order placement.
- Order creation through Cash on Delivery or online payment.
- Customer order history and order detail.
- Order cancellation with sandbox refund simulation for paid orders.

### Provider APIs

- Create provider profile with business information and documents/images.
- Update provider profile.
- Delete provider image.
- Request admin approval.
- Provider dashboard statistics.
- Approved providers can create, update, delete, and manage meal availability.
- Provider order list and order status updates.
- Provider review dashboard.

### Admin & Super Admin APIs

- Admin dashboard statistics.
- View pending providers.
- Approve or reject providers with rejection reason.
- Update provider status.
- View and manage users.
- Suspend, reactivate, or toggle user status.
- Super-admin-only admin account management.
- View all orders and order details.
- View payments and payment details.
- View provider payable summaries.
- Mark provider payments as settled.
- Bulk-settle provider payments.
- Create, update, delete, and toggle categories.
- View and manage support messages.

### Payment & Settlement Logic

- SSLCommerz payment session initiation.
- Success, fail, cancel, and IPN callback handling.
- Atomic payment success finalization to avoid double-crediting revenue.
- Default platform fee: `25%`.
- Provider share: `75%`.
- Provider payable amount is incremented after successful online payment.
- Admin settlement flow marks provider share as paid.
- Sandbox refund simulation reverses provider payable values when applicable.

### Order Tracking

- REST tracking snapshot endpoint.
- Server-Sent Events stream for real-time order updates.
- Order status history records each transition.
- Status flow supports placed, accepted, preparing, out-for-delivery, delivered, cancelled, and refunded states.

### Reviews

- Customers can review delivered orders.
- Review eligibility endpoint prevents invalid review actions.
- Customers can view their own reviews.
- Providers can view paginated review analytics.
- Public provider and meal review endpoints support restaurant detail pages.

<!-- ---

## Screenshots / GIFs

Backend READMEs usually use API examples, database diagrams, or architecture diagrams instead of UI screenshots.

Recommended assets:

```txt
/docs/api-flow.png
/docs/database-schema.png
/docs/auth-flow.png
/docs/payment-flow.png
/docs/order-tracking-flow.gif
```

Example:

```md
![Platera API Architecture](./docs/api-flow.png)
![Payment Flow](./docs/payment-flow.png)
``` -->

---

## Project Structure

```txt
src/
├── app.ts                         # Express app configuration
├── server.ts                      # Local server entry
├── vercel.ts                      # Vercel serverless entry
├── config/                        # Environment, Cloudinary, Multer config
├── errors/                        # Custom error classes
├── helpers/                       # Shared business helpers
├── lib/                           # Better Auth and Prisma clients
├── middlewares/                   # Auth, guards, validation, upload, errors
├── modules/
│   ├── admin/                     # Admin dashboard, users, providers, payments, settlements
│   ├── auth/                      # Register, login, OTP verification, session check
│   ├── cart/                      # Customer cart logic
│   ├── customer/                  # Customer profile logic
│   ├── meal/                      # Provider meal/menu management
│   ├── order/                     # Checkout, orders, status tracking, SSE
│   ├── payment/                   # SSLCommerz payment logic
│   ├── provider/                  # Provider profile and approval request
│   ├── public/                    # Public marketplace APIs
│   ├── reviews/                   # Review system
│   └── support/                   # Contact/support messages
├── routes/                        # API route mounting
├── scripts/                       # Seed scripts
├── types/                         # Shared TypeScript types
└── utils/                         # Email, response, upload, payment, error utilities

prisma/
├── schema/                        # Split Prisma schema files
└── migrations/                    # Database migrations
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone [add-backend-repo-url]
cd platera-server-side
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file.

```bash
cp .env.example .env
```

Update database, auth, email, Cloudinary, and SSLCommerz values.

### 4. Generate Prisma client

```bash
pnpm prisma generate
```

This project uses a custom Prisma client output directory:

```txt
generated/prisma
```

### 5. Run database migrations

```bash
pnpm prisma migrate dev
```

### 6. Seed required data

```bash
pnpm seed:admins
pnpm seed:categories
pnpm seed:demo
```

Use seeded credentials only for local/demo environments and change them before production.

### 7. Start the development server

```bash
pnpm dev
```

The backend should run at:

```txt
http://localhost:5000
```

Base API path:

```txt
http://localhost:5000/api/v1
```

### 8. Build for deployment

```bash
pnpm build:vercel
```

---

## Environment Variables

Never commit real values for production. Use `.env.example` for documentation and configure real values in your hosting provider.

```env
PORT=5000
DATABASE_URL=postgresql://username:password@host:5432/database_name

FRONTEND_LOCAL_HOST=http://localhost:3000
FRONTEND_PROD_HOST=https://your-frontend-domain.com

BACKEND_LOCAL_HOST=http://localhost:5000
BACKEND_PROD_HOST=https://your-backend-domain.com

BETTER_AUTH_SECRET=your-32-character-minimum-secret-key-here
BETTER_AUTH_URL=http://localhost:5000

SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxx

CLAUDINARY_CLOUD_NAME=your-cloud-name
CLAUDINARY_API_KEY=your-api-key
CLAUDINARY_API_SECRET=your-api-secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@platera.com

GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

EMAIL_FROM=noreply@platera.com

SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=superadmin@platera.com
SUPER_ADMIN_PASSWORD=change-this-password

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@platera.com
ADMIN_PASSWORD=change-this-password

SSLCOMMERZ_STORE_ID=your-sslcommerz-store-id
SSLCOMMERZ_STORE_PASSWORD=your-sslcommerz-store-password
SSLCOMMERZ_IS_LIVE=false
SSLCOMMERZ_IPN_URL=http://localhost:5000/api/v1/payments/sslcommerz/ipn
SSLCOMMERZ_SUCCESS_URL=http://localhost:3000/checkout/payment/success
SSLCOMMERZ_FAIL_URL=http://localhost:3000/checkout/payment/fail
SSLCOMMERZ_CANCEL_URL=http://localhost:3000/checkout/payment/cancel
SSLCOMMERZ_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSLCOMMERZ_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
```

---

## API / Architecture

### Base URLs

```txt
Local API Root: http://localhost:5000
API Version:    /api/v1
Auth Handler:   /api/auth/*
```

### Main API Modules

| Module | Base Path | Purpose |
|---|---|---|
| Auth | `/api/v1/auth` | Register, login, logout, email verification, session check |
| Public | `/api/v1/public` | Categories, restaurants, hero stats, top dishes, testimonials |
| Support | `/api/v1/support` | Public contact/support message submission |
| Customers | `/api/v1/customers` | Customer profile APIs |
| Cart | `/api/v1/cart` | Customer cart APIs |
| Orders | `/api/v1/orders` | Checkout, order creation, tracking, cancellation, provider orders |
| Payments | `/api/v1/payments` | SSLCommerz payment initiation and callbacks |
| Reviews | `/api/v1/reviews` | Customer, provider, and public review APIs |
| Provider Profile | `/api/v1/providers` | Provider profile, approval request, provider stats |
| Provider Meals | `/api/v1/provider/meals` | Approved-provider meal/menu management |
| Admin | `/api/v1/admins` | Admin dashboard and platform operations |
| Admin Support | `/api/v1/admins/support` | Support message management |

### Selected Endpoint Map

```txt
GET    /api/v1/public/categories
GET    /api/v1/public/restaurants
GET    /api/v1/public/restaurants/:id
GET    /api/v1/public/restaurants/featured
GET    /api/v1/public/top-dishes

POST   /api/v1/auth/register-customer
POST   /api/v1/auth/register-provider
POST   /api/v1/auth/login
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
GET    /api/v1/auth/session-check

GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:itemId
DELETE /api/v1/cart/items/:itemId
DELETE /api/v1/cart

POST   /api/v1/orders/checkout-preview
POST   /api/v1/orders
GET    /api/v1/orders/my-orders
GET    /api/v1/orders/:id
GET    /api/v1/orders/:id/tracking
GET    /api/v1/orders/:id/tracking/stream
PATCH  /api/v1/orders/:id/cancel
GET    /api/v1/orders/provider/orders
PATCH  /api/v1/orders/:id/provider-status

POST   /api/v1/payments/initiate/:orderId
GET    /api/v1/payments/status/:orderId
POST   /api/v1/payments/sslcommerz/success
POST   /api/v1/payments/sslcommerz/fail
POST   /api/v1/payments/sslcommerz/cancel
POST   /api/v1/payments/sslcommerz/ipn

GET    /api/v1/admins/dashboard
GET    /api/v1/admins/providers/pending
PATCH  /api/v1/admins/providers/:id/approve
PATCH  /api/v1/admins/providers/:id/reject
GET    /api/v1/admins/payables/providers
PATCH  /api/v1/admins/settlements/:paymentId
PATCH  /api/v1/admins/settlements/bulk/:providerId
```

### High-Level Request Flow

```txt
Frontend Request
  ↓
Express App
  ↓
Route Module
  ↓
Auth Middleware / Role Guard / Validation Middleware
  ↓
Controller
  ↓
Service Layer
  ↓
Prisma Transaction / External Service
  ↓
Standard API Response
```

### Payment Flow

```txt
Customer creates ONLINE order
  ↓
Order status = PENDING_PAYMENT
  ↓
Customer initiates SSLCommerz payment
  ↓
Payment record created with 25% platform fee and 75% provider share
  ↓
SSLCommerz redirects/calls backend callback or IPN
  ↓
Backend validates payment
  ↓
Atomic guard prevents duplicate finalization
  ↓
Order status becomes PLACED
  ↓
Cart is cleared
  ↓
Provider payable amount is incremented
```

### Order Tracking Flow

```txt
Provider updates order status
  ↓
Order status history is recorded
  ↓
Order event bus emits update
  ↓
Customer can fetch tracking snapshot or listen through SSE stream
```

---

<!-- ## Live Demo & Credentials

Add safe demo credentials only. Do not expose production admin credentials.

```txt
Backend API: [Add backend deployment URL]
Frontend:    [Add frontend deployment URL]

Customer Demo:
Email: [demo customer email]
Password: [demo password]

Provider Demo:
Email: [demo provider email]
Password: [demo password]

Admin Demo:
Email: [demo admin email]
Password: [demo password]
```

Recommended: keep demo accounts limited and rotate passwords regularly. -->

<!-- --- -->

## Security Awareness

- Secrets are documented through `.env.example`, not hardcoded into source code.
- Better Auth uses server-managed sessions and secure cookie configuration.
- Protected APIs use `authMiddleware` with role checks.
- Admin APIs are protected by admin guard and super-admin guard where needed.
- Provider meal APIs are protected by provider approval guard.
- Zod validation is used before controllers process request payloads.
- SSLCommerz credentials remain server-side only.
- Payment finalization uses an atomic guard to reduce duplicate callback/IPN risk.
- Uploads are processed through Multer/Cloudinary and image validation utilities.
- Centralized error handling avoids leaking raw server errors to clients.
- CORS is configured with explicit frontend origins and credentials support.

---

## Scalability Considerations

- Domain-based modules keep business logic isolated and maintainable.
- Service layer centralizes business rules instead of placing logic directly in routes.
- Prisma transactions protect multi-step operations like checkout, payment finalization, refunds, and settlements.
- Indexes are used in Prisma schema for frequently queried fields such as user IDs, provider IDs, status, payment status, and settlement status.
- API versioning starts at `/api/v1`, allowing future API versions without breaking existing clients.
- Provider settlement records keep platform revenue and provider payable logic auditable.
- SSE order tracking can support real-time UX without requiring a full WebSocket setup.
- The system can be extended with delivery riders, coupons, subscriptions, advanced analytics, notifications, and inventory controls.

---

## Related Repository

This backend is designed to work with the Platera frontend.

```txt
Frontend Repository: [Add frontend repo link here]
Frontend Local URL:  http://localhost:3000
Frontend API Config: NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## Notes

This backend demonstrates system design thinking through:

- Modular API architecture.
- Clear role-based access control.
- Real marketplace workflows, not only CRUD.
- Payment gateway integration with callback/IPN safety.
- Provider revenue sharing and settlement design.
- Transaction-based checkout and payment finalization.
- Real-time order tracking through SSE.
- Validation, centralized error handling, environment-based configuration, and deployment-ready build scripts.
