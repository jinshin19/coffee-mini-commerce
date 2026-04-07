# Jinshin Brew Reserve Coffee House

> A full-stack coffee e-commerce platform — three containerized applications orchestrated via Docker Compose and served through an Nginx reverse proxy on an Ubuntu Server (Oracle VM).

---

## Project Summary

**Jinshin Brew Reserve Coffee House** is a complete, production-ready coffee commerce system composed of three independent applications:

| Application       | Role                                   | Technology       |
| ----------------- | -------------------------------------- | ---------------- |
| `backend`         | REST API server for all business logic | NestJS + MongoDB |
| `frontend-admin`  | Admin dashboard for store management   | Next.js 15       |
| `frontend-coffee` | Customer-facing coffee storefront      | Next.js 15       |

All three services are deployed as Docker containers behind an **Nginx reverse proxy** that routes traffic based on URL path.

---

## Repository Structure

```
coffee/
├── backend/                    — NestJS API server
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           — Admin authentication (JWT)
│   │   │   ├── products/       — Product CRUD + restock + search + filter
│   │   │   ├── orders/         — Order creation + admin order management
│   │   │   ├── dashboard/      — Business metrics aggregation
│   │   │   ├── uploads/        — Payment proof image upload
│   │   │   ├── health/         — Health check endpoint
│   │   │   └── seed/           — Admin user seed on startup
│   │   ├── common/
│   │   │   ├── schemas/        — Mongoose schemas (Product, Order, AdminUser)
│   │   │   ├── decorators/     — HTTPInterceptor (JWT auth guard)
│   │   │   ├── services/       — Response handler utilities
│   │   │   └── interfaces/     — TypeScript shared interfaces
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── env/                    — Environment files per NODE_ENV
│   ├── uploads/                — Uploaded payment proof images (disk storage)
│   ├── public/                 — Static public assets
│   ├── Dockerfile
│   └── README.md               — Full backend documentation
│
├── frontend-admin/             — Next.js Admin Dashboard
│   ├── app/
│   │   ├── login/              — Admin login page
│   │   ├── products/           — Products management page
│   │   └── orders/
│   │       └── [id]/           — Order detail page (dynamic route)
│   ├── components/admin/       — 20 admin UI components
│   ├── context/                — AuthContext (JWT state)
│   ├── services/apis/          — API service layer (auth, products, orders, dashboard)
│   ├── interfaces/             — TypeScript types
│   ├── Dockerfile
│   └── README.md               — Full admin documentation
│
├── frontend-coffee/            — Next.js Customer Storefront
│   ├── app/
│   │   ├── coffee/[slug]/      — Product detail page
│   │   ├── cart/               — Cart page
│   │   ├── checkout/           — Checkout page
│   │   ├── order-success/      — Order success confirmation
│   │   └── api/                — Server-side API proxy routes
│   ├── components/             — 13 storefront UI components
│   ├── context/                — CartContext (localStorage-backed)
│   ├── services/apis/          — API service layer (products, orders)
│   ├── data/                   — Static data (delivery fee, etc.)
│   ├── helpers/                — Utility helpers
│   ├── Dockerfile
│   └── README.md               — Full storefront documentation
│
├── nginx/
│   └── conf.d/
│       └── app.conf            — Nginx reverse proxy routing config
│
├── docker-compose.yaml         — Multi-service orchestration
├── notes.ts                    — Developer notes / known TODOs
└── README.md                   — This file
```

---

## Applications

### 1. Backend — `./backend`

The central API server that powers both frontend applications.

**Tech:** NestJS 10 · MongoDB (Mongoose 8) · TypeScript 5 · JWT · bcrypt · Multer · Swagger

**Key Responsibilities:**

- Admin authentication via username/password + JWT token issuance
- Full product catalog management (create, edit, delete, restock, search, filter, paginate)
- Customer order creation and admin order decision workflow (confirm/reject/delete)
- Dashboard business metrics aggregation (sales, orders, inventory health)
- GCash proof-of-payment image upload (disk storage, max 5 MB)
- Health check endpoint for Docker container liveness probes
- Admin user seeding on first startup
- Swagger UI interactive API docs at `/api-docs`

**API Base:** `http://<server>/api/v1`

→ See [`backend/README.md`](./backend/README.md) for full documentation.

---

### 2. Frontend Admin — `./frontend-admin`

The internal admin dashboard used to manage the coffee store.

**Tech:** Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS 3 · React Context

**Key Features:**

- Secure admin login / signout (JWT-based, token in localStorage)
- Dashboard overview — total products, low stock alerts, incoming orders, confirmed orders, total sales
- Products management — table view with search, filter, pagination, create, edit, restock, delete
- Orders management — table view with search, filter, pagination, order detail drill-down
- Full order detail review — customer info, ordered items, payment proof image, confirm/reject/delete
- Protected routes — all pages except login require a valid JWT token
- Responsive sidebar navigation: Dashboard → Products → Orders → Sign Out

**Accessible at:** `http://<server>/admin`

→ See [`frontend-admin/README.md`](./frontend-admin/README.md) for full documentation.

---

### 3. Frontend Coffee — `./frontend-coffee`

The customer-facing storefront of Jinshin Brew Reserve Coffee House.

**Tech:** Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS 3 · React Context

**Key Features:**

- Homepage with Hero, Featured Products, Full Product Listing, Brand Story, and Testimonials
- Product detail page — full info, roast level, origin, quantity selector
- Add to Cart flow — cart managed in localStorage, quantity adjustment, order summary
- Buy Now flow — directly to checkout with selected product (cart unaffected)
- Cart page — item review, subtotal, delivery fee, total
- Checkout — customer form (name, contact, address), payment method selection
  - **GCash**: QR code display + mandatory proof-of-payment image upload
  - **COD**: No proof required
- Order success confirmation page after successful order placement

**Accessible at:** `http://<server>/`

→ See [`frontend-coffee/README.md`](./frontend-coffee/README.md) for full documentation.

---

## Deployment Architecture

```
                         Internet
                             │
                      Port 80 (HTTP)
                             │
                    ┌────────▼────────┐
                    │   Nginx (proxy) │
                    │  nginx-container │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
      /  (root)          /admin/           /api/
             │               │               │
    ┌────────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
    │ frontend-coffee│ │frontend-admin│ │  backend   │
    │ main-fe-container│ │admin-container│ │backend-container│
    │  Next.js :3000│ │ Next.js :3000│ │ NestJS :3000│
    └───────────────┘ └─────────────┘ └────────────┘
             │               │               │
             └───────────────┴───────────────┘
                             │
                     coffee-network
                     (Docker bridge)
```

---

## Services

| Service   | Container Name      | Image / Build        | Internal Port | Public Path |
| --------- | ------------------- | -------------------- | ------------- | ----------- |
| `backend` | `backend-container` | `./backend/`         | 3000          | `/api/`     |
| `admin`   | `admin-container`   | `./frontend-admin/`  | 3000          | `/admin/`   |
| `main`    | `main-fe-container` | `./frontend-coffee/` | 3000          | `/`         |
| `nginx`   | `nginx-container`   | `nginx:latest`       | 80 (public)   | Entry point |

All services communicate over an internal Docker bridge network named `coffee-network`. Only Nginx exposes a public port.

---

## Nginx Routing

**Config file:** `nginx/conf.d/app.conf`

| URL Path  | Proxied To            | Container       |
| --------- | --------------------- | --------------- |
| `/`       | `http://main:3000/`   | frontend-coffee |
| `/admin/` | `http://admin:3000`   | frontend-admin  |
| `/api/`   | `http://backend:3000` | backend         |

---

## Docker Compose

All services are orchestrated in `docker-compose.yaml`:

```yaml
services:
  backend: # NestJS API — reads ./backend/env/.env.production
  admin: # Admin dashboard — reads ./frontend-admin/.env.production
  main: # Customer storefront — reads ./frontend-coffee/.env.production
  nginx: # Reverse proxy — mounts ./nginx/conf.d/app.conf
    # depends_on: backend, admin, main

networks:
  coffee-network:
    driver: bridge
```

Each service has:

- Docker health checks configured
- `restart: unless-stopped` policy
- Volume mounts for source and `node_modules` isolation

---

## Full API Reference

All API routes are served under `/api/v1`:

```
Auth
├── POST   /api/v1/auth/login            — Admin login (returns JWT)
├── POST   /api/v1/auth/logout           — Admin logout [JWT]
└── GET    /api/v1/auth/check            — Verify token [JWT]

Products
├── GET    /api/v1/products              — List products (search, filter, paginate)
├── GET    /api/v1/products/filters/options  — Distinct filter values
├── GET    /api/v1/products/:id          — Get single product
├── POST   /api/v1/products              — Create product [JWT]
├── PATCH  /api/v1/products/:id          — Update product [JWT]
├── PATCH  /api/v1/products/:id/stock    — Restock product [JWT]
└── DELETE /api/v1/products/:id          — Delete product [JWT]

Orders
├── GET    /api/v1/orders                — List orders (paginated) [JWT]
├── GET    /api/v1/orders/:id            — Order details [JWT]
├── POST   /api/v1/orders                — Create order (public)
├── PATCH  /api/v1/orders/:id/confirm    — Confirm order [JWT]
├── PATCH  /api/v1/orders/:id/reject     — Reject order [JWT]
├── PATCH  /api/v1/orders/:id/status     — Update order status [JWT]
└── DELETE /api/v1/orders/:id            — Delete order [JWT]

Dashboard
└── GET    /api/v1/dashboard/overview    — Business metrics [JWT]

Uploads
└── POST   /api/v1/uploads/proof         — Upload payment proof (public, max 5MB)

Health
└── GET    /api/v1/health                — Service health check
```

---

## Database

| Collection   | Description                                 |
| ------------ | ------------------------------------------- |
| `products`   | Coffee product catalog                      |
| `orders`     | Customer orders with embedded order items   |
| `adminusers` | Admin credentials (bcrypt-hashed passwords) |

All document IDs use **ULID** format for sortable, collision-resistant identifiers.

**Connection:** Configured via `MONGODB_URI` environment variable.

---

## Environment Configuration

### Backend (`backend/env/.env.production`)

| Variable                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `PORT`                       | Port the backend listens on (default: 3000) |
| `NODE_ENV`                   | `production`                                |
| `MONGODB_URI`                | MongoDB connection string                   |
| `CORS_ORIGIN`                | Allowed origins (comma-separated)           |
| `JINSHIN_COFFEE_UPLOAD_PATH` | Public base URL for uploaded proof images   |

### Frontend Admin (`frontend-admin/.env.production`)

| Variable              | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL for client-side requests                   |
| `NEXT_PUBLIC_PATH_1`  | Relative API path via Nginx (`/api/v1`)                    |
| `NEXT_PUBLIC_PATH_2`  | Internal Docker network URL (`http://backend:3000/api/v1`) |
| `NEXT_PUBLIC_ST_KEY`  | localStorage key for JWT token                             |

### Frontend Coffee (`frontend-coffee/.env.production`)

| Variable                          | Description                               |
| --------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_API_URL`             | Backend API URL for client-side requests  |
| `NEXT_PUBLIC_PATH_1`              | Relative API path via Nginx (`/api/v1`)   |
| `NEXT_PUBLIC_PATH_2`              | Internal Docker network URL               |
| `NEXT_PUBLIC_CART_STORAGE_KEY`    | localStorage key for cart data            |
| `NEXT_PUBLIC_INSTANT_STORAGE_KEY` | localStorage key for Buy Now instant item |

---

## Deployment Guide

### Target Environment

- **Host:** Oracle VM VirtualBox
- **OS:** Ubuntu Server
- **Runtime:** Docker Engine + Docker Compose
- **Proxy:** Nginx (containerized, port 80)

---

### Prerequisites

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
sudo apt install docker-compose-plugin

# Verify
docker --version
docker compose version
```

---

### Step 1 — Clone the Repository

```bash
git clone <repo-url>
cd coffee
```

---

### Step 2 — Configure Environment Files

Create the production environment files for each service:

```bash
# Backend
cp backend/.env.example backend/env/.env.production
# Edit backend/env/.env.production with real values

# Admin (duplicate and update)
cp frontend-admin/.env.local frontend-admin/.env.production

# Coffee storefront (duplicate and update)
cp frontend-coffee/.env.local frontend-coffee/.env.production
```

> **Important:** Update all `NEXT_PUBLIC_API_URL` values to point to your actual server IP or domain.

---

### Step 3 — Build and Start All Containers

```bash
docker compose up --build -d
```

---

### Step 4 — Verify Running Containers

```bash
docker ps
```

You should see four running containers:

| Container           | Status |
| ------------------- | ------ |
| `backend-container` | Up     |
| `admin-container`   | Up     |
| `main-fe-container` | Up     |
| `nginx-container`   | Up     |

---

### Step 5 — Access the Applications

| Application       | URL                              |
| ----------------- | -------------------------------- |
| Coffee Storefront | `http://<server-ip>/`            |
| Admin Dashboard   | `http://<server-ip>/admin`       |
| Backend API       | `http://<server-ip>/api/v1`      |
| Swagger Docs      | `http://<server-ip>/api/v1/docs` |

---

## Useful Docker Commands

```bash
# View logs for a specific service
docker compose logs -f backend
docker compose logs -f admin
docker compose logs -f main

# Stop all containers
docker compose down

# Rebuild a specific service
docker compose up --build backend -d

# Restart a service
docker compose restart nginx
```

---

## Application Sitemaps

### Admin Dashboard

```
/login                      — Login (public)
/products                   — Product Management (protected)
/orders                     — Orders List (protected)
/orders/[id]                — Order Detail (protected)
```

### Customer Storefront

```
/                           — Homepage (hero, featured, listing, story)
/coffee/[slug]              — Product Detail
/cart                       — Shopping Cart
/checkout                   — Checkout (customer form + payment)
/order-success              — Order Confirmation
```

### Backend API

```
/api/v1/auth/*
/api/v1/products/*
/api/v1/orders/*
/api/v1/dashboard/*
/api/v1/uploads/*
/api/v1/health
/api-docs                   — Swagger UI
```

---

## Order Lifecycle

```
Customer places order      →  Status: "pending"
        │
        ├── Admin confirms  →  Status: "confirmed"  (counted in total sales)
        │
        └── Admin rejects   →  Status: "rejected"
```

---

## Networking

All containers share the `coffee-network` Docker bridge network. Inter-service communication uses Docker service names as hostnames:

```
nginx     → main:3000       (frontend-coffee)
nginx     → admin:3000      (frontend-admin)
nginx     → backend:3000    (NestJS API)
admin     → backend:3000    (server-side API calls)
main      → backend:3000    (server-side API calls)
```

No ports are directly exposed except Nginx on port 80.

---

## Production Notes

- Expose **only port 80** (or 443 for HTTPS) via Nginx
- Keep backend and frontend containers internal (no direct port exposure)
- Use Nginx as the sole public entry point
- For HTTPS: add SSL certificates to `nginx/ssl/` and update `app.conf`
- MongoDB should ideally run as a separate persistent service or managed instance

---

## Known Issues / TODOs

> From `notes.ts` — tracked developer notes:

1. **Product edit slug** — When editing a product, the slug field should be read-only or optional (not editable after creation)
2. **Token validation gap** — The `GET /products` endpoint does not use `HTTPInterceptor`, meaning an intentionally tampered token still allows product listing. A request origin validation strategy (admin vs. customer) is needed
3. **Dashboard metrics** — Total products and low-stock counts in the dashboard overview need a review/fix for accuracy
4. **Button animations** — Add click animations to all action buttons across the UI
5. **Shared utility library** — Create one reusable service/utility library shared between frontends to eliminate redundant imports

---

## Future Enhancements

- HTTPS support with Let's Encrypt SSL
- Domain name configuration
- CI/CD deployment pipeline (GitHub Actions)
- MongoDB as a Docker container with persistent volume
- Rate limiting and DDOS protection at Nginx level
- Auth hardening (refresh tokens, session expiry)
- Email notifications for order events
- Customer-facing order tracking page

---

## Summary

**Jinshin Brew Reserve Coffee House** is a complete, production-deployable coffee e-commerce system built with a modern full-stack architecture:

- **Backend** — NestJS + MongoDB REST API with JWT authentication, full product and order management, file uploads, and Swagger documentation
- **Admin Dashboard** — Next.js admin panel with secure login, product catalog control, inventory monitoring, and order decision workflow
- **Customer Storefront** — Next.js customer-facing store with product browsing, cart management, GCash/COD checkout, and order success flow
- **Infrastructure** — Docker Compose orchestration with Nginx reverse proxy, designed for clean deployment on an Ubuntu Server VM

The architecture cleanly separates concerns across all three services while allowing them to communicate efficiently through Docker's internal networking layer.
