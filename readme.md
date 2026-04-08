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
│   │   │   ├── auth/           — Admin authentication (NODE-RSA)
│   │   │   ├── products/       — Product CRUD + restock + search + filter
│   │   │   ├── orders/         — Order creation + admin order management
│   │   │   ├── dashboard/      — Business metrics aggregation
│   │   │   ├── uploads/        — Payment proof image upload
│   │   │   ├── health/         — Health check endpoint
│   │   │   └── seed/           — Admin user seed on startup
│   │   ├── common/
│   │   │   ├── schemas/        — Mongoose schemas (Product, Order, AdminUser)
│   │   │   ├── decorators/     — HTTPInterceptor (NODE-RSA)
│   │   │   ├── services/       — Response handler utilities
│   │   │   └── interfaces/     — TypeScript shared interfaces
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── env/                    — Environment files per NODE_ENV
│   ├── uploads/                — Image upload via ImageKit (proof-of-payment)
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
│   ├── context/                — AuthContext (NODE-RSA encrypted token state)
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

**Tech:** NestJS 10 · MongoDB (Mongoose 8) · TypeScript 5 · NODE-RSA · bcrypt · Multer · Swagger

**Key Responsibilities:**

- Admin authentication via username/password + NODE-RSA token issuance
- Full product catalog management (create, edit, delete, restock, search, filter, paginate)
- Customer order creation and admin order decision workflow (confirm/reject/delete)
- Dashboard business metrics aggregation (sales, orders, inventory health)
- GCash proof-of-payment image upload (Multer (memory) + ImageKit storage, max 5 MB)
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

- Secure admin login / signout (NODE-RSA-based, token in localStorage)
- Dashboard overview — total products, low stock alerts, incoming orders, confirmed orders, total sales
- Products management — table view with search, filter, pagination, create, edit, restock, delete
- Orders management — table view with search, filter, pagination, order detail drill-down
- Full order detail review — customer info, ordered items, payment proof image, confirm/reject/delete
- Protected routes — all pages except login require a valid NODE-RSA token
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
| `/api-docs/`   | `http://backend:3000` | Swagger         |

---

## Docker Compose

All services are orchestrated in `docker-compose.yaml`:

```yaml
services:
  backend: # NestJS API — reads ./backend/env/.env.production
  admin: # Admin dashboard — reads ./frontend-admin/.env.production
  main: # Customer storefront — reads ./frontend-coffee/.env.production
  nginx: # Reverse proxy — built from ./nginx Dockerfile (COPY nginx/conf.d/app.conf)
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
├── POST   /api/v1/auth/login            — Admin login (returns NODE-RSA)
├── POST   /api/v1/auth/logout           — Admin logout [NODE-RSA]
└── GET    /api/v1/auth/check            — Verify token [NODE-RSA]

Products
├── GET    /api/v1/products              — List products (search, filter, paginate)
├── GET    /api/v1/products/filters/options  — Distinct filter values
├── GET    /api/v1/products/:id          — Get single product
├── POST   /api/v1/products              — Create product [NODE-RSA]
├── PATCH  /api/v1/products/:id          — Update product [NODE-RSA]
├── PATCH  /api/v1/products/:id/stock    — Restock product [NODE-RSA]
└── DELETE /api/v1/products/:id          — Delete product [NODE-RSA]

Orders
├── GET    /api/v1/orders                — List orders (paginated) [NODE-RSA]
├── GET    /api/v1/orders/:id            — Order details [NODE-RSA]
├── POST   /api/v1/orders                — Create order (public)
├── PATCH  /api/v1/orders/:id/confirm    — Confirm order [NODE-RSA]
├── PATCH  /api/v1/orders/:id/reject     — Reject order [NODE-RSA]
├── PATCH  /api/v1/orders/:id/status     — Update order status [NODE-RSA]
└── DELETE /api/v1/orders/:id            — Delete order [NODE-RSA]

Dashboard
└── GET    /api/v1/dashboard/overview    — Business metrics [NODE-RSA]

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

| Variable                         Description                                      |
| -------------------------------- | ------------------------------------------------ |
| `NODE_ENV`                       | Environment mode                                 |
| `PORT`                           | Port the server listens on                       |
| `MONGODB_URI`                    | MongoDB connection string                        |
| `CORS_ORIGIN`                    | Allowed CORS origins (comma-separated)           |
| `ADMIN_USERNAME`                 | Default admin username                           |
| `ADMIN_PASSWORD`                 | Default admin password                           |
| `IMAGEKIT_PRIVATE_KEY`           | ImageKit private API key                         |
| `IMAGEKIT_UPLOAD_URL`            | ImageKit upload endpoint                         |
| `IMAGEKIT_PROOFS_FOLDER`         | ImageKit folder for proof uploads                |
| `JINSHIN_COFFEE_PUBLIC_KEY`      | RSA public key used for auth / verification      |
| `JINSHIN_COFFEE_PRIVATE_KEY`     | RSA private key used for signing tokens          |

### Frontend Admin (`frontend-admin/.env.production`)

| Variable                    | Description                             |
| --------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_NODE_ENV`      | Environment mode                        |
| `NEXT_PUBLIC_ST_KEY`        | localStorage key for encrypted node-rsa token          |
| `NEXT_PUBLIC_HOST_URL`      | Admin app base URL                      |
| `NEXT_PUBLIC_API_URL`       | Backend API URL (local)                 |
| `NEXT_PUBLIC_PATH_1`        | API base URL for client-side requests |
| `NEXT_PUBLIC_PATH_2`        | API base URL for SSR/server-side requests |

---
### Frontend Coffee (`frontend-coffee/.env.production`)

| Variable                           | Description |
| ---------------------------------- | ----------- |
| `NEXT_PUBLIC_NODE_ENV`             | Frontend environment mode |
| `NEXT_PUBLIC_API_URL`              | API URL for development |
| `NEXT_PUBLIC_PATH_1`               | API base URL for client-side requests |
| `NEXT_PUBLIC_PATH_2`               | API base URL for SSR/server-side requests |
| `NEXT_PUBLIC_CART_STORAGE_KEY`     | LocalStorage key for cart |
| `NEXT_PUBLIC_INSTANT_STORAGE_KEY`  | LocalStorage key for instant checkout |
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
cd to the project
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
---

### Step 3 — Build and Start All Containers

```bash
sudo docker-compose up -d
```

---

### Step 4 — Verify Running Containers

```bash
sudo docker ps -a
```

You should see four running containers:

| Container           | Status |
| ------------------- | ------ |
| `backend-container` | Up (healthy) |
| `admin-container`   | Up (healthy) |
| `main-fe-container` | Up (healthy) |
| `nginx-container`   | Up (healthy) |

---

### Step 5 — Access the Applications

| Application       | URL                              |
| ----------------- | -------------------------------- |
| Coffee Storefront | `http://<server-ip>/`            |
| Admin Dashboard   | `http://<server-ip>/admin`       |
| Backend API       | `http://<server-ip>/api/v1`      |
| Swagger Docs      | `http://<server-ip>/api-docs` |

---

## Useful Docker Commands

```bash
# View logs for a specific service
sudo docker-compose logs -f backend
sudo docker-compose logs -f admin
sudo docker-compose logs -f main

# Stop all containers
sudo docker-compose down

# Rebuild a specific service
sudo docker-compose up -d --build backend

# Restart a service (container)
sudo docker-compose restart nginx-container
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

No ports are directly exposed except Nginx on port 80. When using VM with NAT, exposed port is 8080 pointed to guest port of 80

---

## Production Notes

- Expose **only port 80** (or 443 for HTTPS) via Nginx
- Keep backend and frontend containers internal (no direct port exposure)
- Use Nginx as the sole public entry point
- For HTTPS: add SSL certificates to `nginx/ssl/` and update `app.conf`
- MongoDB should ideally run as a separate persistent service or managed instance

---

## Summary

**Jinshin Brew Reserve Coffee House** is a complete, production-deployable coffee e-commerce system built with a modern full-stack architecture:

- **Backend** — NestJS + MongoDB REST API with NODE-RSA authentication, full product and order management, file uploads, and Swagger documentation
- **Admin Dashboard** — Next.js admin panel with secure login, product catalog control, inventory monitoring, and order decision workflow
- **Customer Storefront** — Next.js customer-facing store with product browsing, cart management, GCash/COD checkout, and order success flow
- **Infrastructure** — Docker Compose orchestration with Nginx reverse proxy, designed for clean deployment on an Ubuntu Server VM

The architecture cleanly separates concerns across all three services while allowing them to communicate efficiently through Docker's internal networking layer.
