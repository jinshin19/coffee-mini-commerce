# Backend — Jinshin Brew Reserve Coffee House

## Overview

The **Backend** is the central API server that powers both the Admin Dashboard (`frontend-admin`) and the Customer Storefront (`frontend-coffee`).

Built with **NestJS** and **MongoDB (Mongoose)**, the backend handles all business logic including admin authentication, full product catalog management, customer order processing, file uploads, and dashboard analytics. It exposes a versioned REST API at `/api/v1` and includes a Swagger UI for interactive documentation.

---

## Technology Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Framework      | NestJS 10                             |
| Language       | TypeScript 5.6                        |
| Runtime        | Node.js                               |
| Database       | MongoDB via Mongoose 8                |
| Authentication | JWT (`@nestjs/jwt`) + bcrypt          |
| Validation     | class-validator + class-transformer   |
| File Upload    | Multer (disk storage)                 |
| API Docs       | Swagger (`@nestjs/swagger`)           |
| ID Generation  | ULID (`ulidx`)                        |
| Date Handling  | Luxon                                 |
| Containerized  | Docker                                |

---

## Architecture Summary

```
Internet
    │
    ▼
Nginx (reverse proxy)
    ├── /api  →  Backend (NestJS — port 3000)
    │
    ├── /admin → frontend-admin (Next.js)
    └── /     → frontend-coffee (Next.js)
```

The backend exposes a single versioned API prefix:

```
Base URL: /api/v1
```

All admin-protected routes use a Bearer token interceptor (`HTTPInterceptor`). Public product and order creation routes are unauthenticated.

---

## Application Modules

### Module Map

```
src/
├── main.ts                    — Bootstrap, CORS, global prefix, Swagger
├── app.module.ts              — Root module: DB, static files, all feature modules
└── modules/
    ├── auth/                  — Admin authentication (login, logout, check)
    ├── products/              — Full product CRUD + restock + filters
    ├── orders/                — Customer order creation + admin order management
    ├── dashboard/             — Aggregated business metrics
    ├── uploads/               — Proof-of-payment image upload
    ├── health/                — Health check endpoint
    └── seed/                  — Admin user seeding on startup
```

---

## Module Details

### 1. Auth Module

**Path:** `src/modules/auth/`

Handles admin authentication using username/password credentials. On success, generates a signed JWT authorization token.

#### Endpoints

| Method | Route           | Auth Required | Description                     |
| ------ | --------------- | ------------- | ------------------------------- |
| POST   | `/auth/login`   | No            | Authenticate admin, returns JWT |
| POST   | `/auth/logout`  | Yes (JWT)     | Invalidate/end admin session    |
| GET    | `/auth/check`   | Yes (JWT)     | Verify token validity           |

#### Auth Flow

1. Admin submits `username` + `password`
2. Backend finds admin user by username in MongoDB
3. `bcrypt.compare()` validates the password against the stored hash
4. On success, a JWT token is generated with payload: `{ subId, username, role: "admin", userAgent }`
5. Token and expiry timestamp returned to client

#### Security Notes

- Passwords are stored as bcrypt hashes (salt rounds: 12)
- JWT token used for all protected routes via `HTTPInterceptor`
- Admin seeding handled by `SeedModule` on first startup

---

### 2. Products Module

**Path:** `src/modules/products/`

Full product lifecycle management — used by both the admin dashboard (CRUD, restock) and the customer storefront (browse, search, filter).

#### Endpoints

| Method | Route                      | Auth Required | Description                           |
| ------ | -------------------------- | ------------- | ------------------------------------- |
| GET    | `/products`                | No            | List products (paginated, searchable) |
| GET    | `/products/filters/options` | No           | Get distinct filter values            |
| GET    | `/products/:id`            | No            | Get single product by ID              |
| POST   | `/products`                | Yes (JWT)     | Create a new product                  |
| PATCH  | `/products/:id`            | Yes (JWT)     | Update product by ID                  |
| PATCH  | `/products/:id/stock`      | Yes (JWT)     | Add stock (restock) by ID             |
| DELETE | `/products/:id`            | Yes (JWT)     | Permanently delete product            |

#### Query Parameters (`GET /products`)

| Parameter   | Type    | Description                                           |
| ----------- | ------- | ----------------------------------------------------- |
| `page`      | number  | Page number (default: 1)                              |
| `limit`     | number  | Items per page                                        |
| `search`    | string  | Keyword search across name, slug, category, etc.      |
| `filter`    | string  | `all`, `low-stock`, `featured`, `bestseller`, `in-stock`, `out-of-stock` |
| `sortBy`    | string  | Field to sort by (e.g., `updatedAt`)                  |
| `sortOrder` | string  | `asc` or `desc`                                       |

#### Product Schema

| Field              | Type    | Required | Description                                    |
| ------------------ | ------- | -------- | ---------------------------------------------- |
| `_id`              | string  | Auto     | ULID-based unique identifier                   |
| `slug`             | string  | Yes      | URL-friendly identifier                        |
| `name`             | string  | Yes      | Product display name                           |
| `category`         | string  | Yes      | Product category                               |
| `shortDescription` | string  | Yes      | Brief product description                      |
| `description`      | string  | No       | Full product description                       |
| `price`            | number  | Yes      | Product price                                  |
| `image`            | string  | Yes      | Image URL or path                              |
| `roastLevel`       | enum    | Yes      | `dark`, `light`, `medium`, `espresso`, `medium-dark`, `medium-light` |
| `origin`           | string  | No       | Country/region of origin                       |
| `bestSeller`       | boolean | No       | Marks product as best seller (default: false)  |
| `featured`         | boolean | No       | Marks product as featured (default: false)     |
| `stock`            | number  | Yes      | Current inventory count (min: 0)               |

---

### 3. Orders Module

**Path:** `src/modules/orders/`

Manages the full order lifecycle — customers create orders, admins review and act on them.

#### Endpoints

| Method | Route                     | Auth Required | Description                            |
| ------ | ------------------------- | ------------- | -------------------------------------- |
| GET    | `/orders`                 | Yes (JWT)     | List all orders (paginated, searchable)|
| GET    | `/orders/:id`             | Yes (JWT)     | Get full order details by ID           |
| POST   | `/orders`                 | No            | Customer places a new order            |
| PATCH  | `/orders/:id/confirm`     | Yes (JWT)     | Admin confirms an order                |
| PATCH  | `/orders/:id/reject`      | Yes (JWT)     | Admin rejects an order                 |
| PATCH  | `/orders/:id/status`      | Yes (JWT)     | Generic status update                  |
| DELETE | `/orders/:id`             | Yes (JWT)     | Permanently delete an order            |

#### Order Schema

**Order (parent document)**

| Field            | Type          | Required | Description                               |
| ---------------- | ------------- | -------- | ----------------------------------------- |
| `_id`            | string        | Auto     | ULID-based unique identifier              |
| `name`           | string        | Yes      | Customer full name                        |
| `contactNumber`  | string        | Yes      | Customer contact number                   |
| `address`        | string        | Yes      | Delivery address                          |
| `paymentMethod`  | enum          | Yes      | `gcash` or `cod`                          |
| `proofOfPayment` | string / null | No       | File URL of uploaded payment proof image  |
| `status`         | enum          | Auto     | `pending`, `confirmed`, `rejected` (default: `pending`) |
| `items`          | OrderItem[]   | Yes      | Array of ordered products                 |
| `subtotal`       | number        | Yes      | Sum of all item totals                    |
| `total`          | number        | Yes      | Final amount including fees               |
| `createdAt`      | Date          | Auto     | MongoDB timestamp                         |

**OrderItem (embedded sub-document)**

| Field       | Type   | Required | Description             |
| ----------- | ------ | -------- | ----------------------- |
| `_id`       | string | Auto     | ULID-based item ID      |
| `productId` | string | Yes      | Reference to product ID |
| `name`      | string | Yes      | Product name at time of order |
| `image`     | string | Yes      | Product image URL       |
| `price`     | number | Yes      | Unit price at time of order |
| `quantity`  | number | Yes      | Quantity ordered (min: 1) |

#### Order Status Lifecycle

```
Customer places order → status: "pending"
        │
        ├── Admin confirms → status: "confirmed"  (counted in sales)
        │
        └── Admin rejects  → status: "rejected"
```

---

### 4. Dashboard Module

**Path:** `src/modules/dashboard/`

Provides aggregated business metrics for the Admin Dashboard overview page.

#### Endpoints

| Method | Route                  | Auth Required | Description               |
| ------ | ---------------------- | ------------- | ------------------------- |
| GET    | `/dashboard/overview`  | Yes (JWT)     | Get all dashboard metrics |

#### Dashboard Response Data

| Metric               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `totalProducts`      | Total products in catalog                      |
| `lowStockProducts`   | Products with stock ≤ 10                       |
| `outOfStockProducts` | Products with stock = 0                        |
| `featuredProducts`   | Products flagged as featured                   |
| `bestSellerProducts` | Products flagged as best seller                |
| `incomingOrders`     | Orders with `pending` status                   |
| `confirmedOrders`    | Orders with `confirmed` status                 |
| `rejectedOrders`     | Orders with `rejected` status                  |
| `totalOrders`        | All orders regardless of status                |
| `totalSales`         | Revenue from confirmed orders only             |

---

### 5. Uploads Module

**Path:** `src/modules/uploads/`

Handles proof-of-payment image uploads from customers during the GCash checkout flow.

#### Endpoints

| Method | Route            | Auth Required | Description                                 |
| ------ | ---------------- | ------------- | ------------------------------------------- |
| POST   | `/uploads/proof` | No            | Upload a payment proof image (max 5MB)      |

#### Upload Behavior

- Accepts image files only (`image/*` MIME types)
- Max file size: **5 MB**
- Files saved to: `uploads/proofs/` directory on disk
- Filename format: `{timestamp}-{sanitized-basename}.{ext}`
- Returns a public-accessible file URL

---

### 6. Health Module

**Path:** `src/modules/health/`

Provides a simple health check endpoint used by Docker for container liveness checks.

#### Endpoints

| Method | Route              | Auth Required | Description              |
| ------ | ------------------ | ------------- | ------------------------ |
| GET    | `/health`          | No            | Returns service status   |

---

### 7. Seed Module

**Path:** `src/modules/seed/`

Runs on application startup to initialize the default admin user in the database if none exists.

**Behavior:**
- If an admin user already exists → skipped (no duplicate created)
- If none exists → creates one with bcrypt-hashed password
- Admin credentials pulled from environment variables

---

## Database Collections

| Collection    | Mongoose Model | Description                     |
| ------------- | -------------- | ------------------------------- |
| `products`    | `Product`      | Coffee product catalog          |
| `orders`      | `Order`        | Customer orders with items      |
| `adminusers`  | `AdminUser`    | Admin credentials (hashed)      |

All IDs use **ULID** format (via `ulidx`) for sortable, collision-resistant identifiers.

---

## Environment Variables

| Variable                        | Example Value                        | Description                              |
| ------------------------------- | ------------------------------------ | ---------------------------------------- |
| `NODE_ENV`                      | `production`                         | Environment mode                         |
| `PORT`                          | `3000`                               | Port the server listens on               |
| `MONGODB_URI`                   | `mongodb://localhost:27017/coffee`   | MongoDB connection string                |
| `CORS_ORIGIN`                   | `http://localhost:3000`              | Allowed CORS origins (comma-separated)   |
| `AUTHORIZATION_KEY`             | *(JWT secret key name)*              | Key name for Swagger bearer auth         |
| `JINSHIN_COFFEE_UPLOAD_PATH`    | `http://localhost:3000/uploads/proofs/` | Public base URL for uploaded files    |

Environment files are loaded from `env/.env.{NODE_ENV}`.

---

## Static File Serving

The backend serves two static directories:

| Serve Root | Directory             | Purpose                         |
| ---------- | --------------------- | ------------------------------- |
| `/`        | `public/`             | General public assets           |
| `/uploads` | `uploads/`            | Payment proof images            |

---

## API Documentation (Swagger)

Swagger UI is available at:

```
http://localhost:{PORT}/api-docs
```

All endpoints are tagged and documented with `@ApiTags` and `@ApiOperation` decorators.

---

## Full API Route Reference

```
Base: /api/v1

Auth
├── POST   /auth/login          — Admin login (returns JWT)
├── POST   /auth/logout         — Admin logout [JWT required]
└── GET    /auth/check          — Token check [JWT required]

Products
├── GET    /products            — List products (search, filter, paginate)
├── GET    /products/filters/options  — Distinct filter values
├── GET    /products/:id        — Get product by ID
├── POST   /products            — Create product [JWT required]
├── PATCH  /products/:id        — Update product [JWT required]
├── PATCH  /products/:id/stock  — Restock product [JWT required]
└── DELETE /products/:id        — Delete product [JWT required]

Orders
├── GET    /orders              — List orders (paginated) [JWT required]
├── GET    /orders/:id          — Get order details [JWT required]
├── POST   /orders              — Create order (public — customers)
├── PATCH  /orders/:id/confirm  — Confirm order [JWT required]
├── PATCH  /orders/:id/reject   — Reject order [JWT required]
├── PATCH  /orders/:id/status   — Update order status [JWT required]
└── DELETE /orders/:id          — Delete order [JWT required]

Dashboard
└── GET    /dashboard/overview  — Business metrics [JWT required]

Uploads
└── POST   /uploads/proof       — Upload payment proof image (public)

Health
└── GET    /health              — Service health check
```

---

## Pagination

Supported on both `GET /products` and `GET /orders`.

**Standard Pagination Response Shape:**

```json
{
  "items": [...],
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10
}
```

---

## Running Locally

```bash
# Development (with watch mode)
npm run start:dev

# Production
npm run start:prod

# Build
npm run build
```

---

## Docker

The backend is containerized via `Dockerfile` and orchestrated with Docker Compose.

```yaml
# In docker-compose.yaml
backend:
  build: ./backend/
  env_file: ./backend/env/.env.production
  healthcheck:
    test: curl -fsS http://localhost:3000/api/v1/health
  restart: unless-stopped
  networks:
    - coffee-network
```

---

## Functional Sitemap (API Level)

```
/api/v1
├── /auth
│   ├── POST   /login
│   ├── POST   /logout
│   └── GET    /check
├── /products
│   ├── GET    /
│   ├── GET    /filters/options
│   ├── GET    /:id
│   ├── POST   /
│   ├── PATCH  /:id
│   ├── PATCH  /:id/stock
│   └── DELETE /:id
├── /orders
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /
│   ├── PATCH  /:id/confirm
│   ├── PATCH  /:id/reject
│   ├── PATCH  /:id/status
│   └── DELETE /:id
├── /dashboard
│   └── GET    /overview
├── /uploads
│   └── POST   /proof
└── /health
    └── GET    /
```

---

## Summary

The Backend is a production-ready NestJS application serving as the single source of truth for the entire **Jinshin Brew Reserve Coffee House** platform.

It provides:

- Secure admin authentication with JWT and bcrypt
- Complete product catalog management with search, filter, and pagination
- Full customer order lifecycle management with admin decision workflow
- Aggregated dashboard analytics for operational monitoring
- Proof-of-payment image upload with file storage
- Swagger-powered interactive API documentation
- Docker-ready containerized deployment

The system is designed to be clean, modular, and maintainable — supporting real-world coffee commerce operations at both admin and customer levels.
