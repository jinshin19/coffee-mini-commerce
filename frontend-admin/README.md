# Frontend Admin — Jinshin Brew Reserve Coffee House

## Overview

The **Frontend Admin** is the internal management dashboard for the **Jinshin Brew Reserve Coffee House** platform. Built exclusively for the store administrator, it provides full control over product inventory, customer order management, and operational business insights.

This application connects to the backend API to perform all data operations. It is protected behind an admin login and is accessible only to authorized users.

---

## Technology Stack

| Layer        | Technology               |
| ------------ | ------------------------ |
| Framework    | Next.js 15 (App Router)  |
| Language     | TypeScript 5.8           |
| UI Library   | React 19                 |
| Styling      | Tailwind CSS 3.4         |
| State        | React Context API        |
| API Client   | Fetch (custom service layer) |
| Containerized | Docker                  |

---

## Application Scope

The Admin Dashboard covers four primary functional areas:

1. **Authentication** — Secure admin login and signout
2. **Dashboard Overview** — Key business metrics and inventory watchlist
3. **Products Management** — Full product catalog CRUD with search, filter, and pagination
4. **Orders Management** — Order monitoring, details review, and admin decision workflow

---

## Application Structure

```
frontend-admin/
├── app/                        — Next.js App Router pages
│   ├── layout.tsx              — Root layout with auth guard
│   ├── page.tsx                — Root redirect (→ /products)
│   ├── login/                  — Admin login page
│   ├── products/               — Products management page
│   ├── orders/
│   │   ├── page.tsx            — Orders list page
│   │   └── [id]/               — Order detail page (dynamic route)
│   └── not-found.tsx           — 404 page
├── components/
│   └── admin/                  — All admin UI components (20 components)
├── context/
│   └── AuthContext.tsx         — Auth state management (JWT storage)
├── services/
│   ├── apis/
│   │   ├── src/
│   │   │   ├── auth/           — Auth API calls
│   │   │   ├── products/       — Products API calls
│   │   │   ├── orders/         — Orders API calls
│   │   │   └── dashboard/      — Dashboard API calls
│   │   └── api.service.ts      — Base HTTP service
│   └── handlers/               — Response processing utilities
├── interfaces/                 — TypeScript type definitions
└── lib/                        — Utility functions
```

---

## Page Sitemap

```
/login                      — Admin Login (public, unauthenticated)
/                            — Redirect → /products (protected)
/products                   — Products Management Page (protected)
/orders                     — Orders List Page (protected)
/orders/[id]                — Order Detail Page (protected)
```

---

## Pages

### Login Page — `/login`

The entry point for admin access. Unauthenticated users are redirected here from any protected page.

**Features:**
- Username + password form
- Calls `POST /api/v1/auth/login`
- On success: stores JWT token in context/localStorage and redirects to `/products`
- On failure: shows error message

**Key Component:** `LoginPage` (app/login/page.tsx)

---

### Products Page — `/products`

The primary product management workspace. Requires authentication.

**Features:**
- **Product table** — paginated list of all products
- **Search** — search by name, slug, category, roast level, or origin
- **Filter tabs** — All, Featured, Best Seller, Low Stock, In Stock, Out of Stock
- **Pagination controls** — previous/next, current page, total count
- **Create Product** — opens a modal form to add a new product
- **Edit Product** — inline edit action from table row
- **Restock Product** — opens a stock modal to add inventory
- **Delete Product** — confirmation dialog before permanent removal

**Key Components:**
- `ProductsPageView.tsx` — page-level container with search, filter, pagination state
- `ProductTable.tsx` — renders the product data table with action buttons
- `ProductFormModal.tsx` — create/edit product form modal
- `StockModal.tsx` — restock quantity input modal
- `ConfirmDialog.tsx` — delete confirmation dialog

**Product Table Columns:**

| Column      | Description                              |
| ----------- | ---------------------------------------- |
| Image       | Product thumbnail                        |
| Name        | Product display name                     |
| Category    | Product category                         |
| Price       | Unit price                               |
| Roast Level | Roast level (dark, light, medium, etc.)  |
| Origin      | Country/region of coffee origin          |
| Stock       | Current inventory count                  |
| Flags       | Featured / Best Seller badges            |
| Actions     | Edit, Restock, Delete buttons            |

---

### Orders Page — `/orders`

The order monitoring workspace. Requires authentication.

**Features:**
- **Orders table** — paginated list of all customer orders
- **Search** — search by order ID, customer name, contact number, payment method, or status
- **Filter tabs** — All, Pending, Incoming, Confirmed, Rejected
- **Pagination controls**
- **Click to open details** — navigates to `/orders/[id]`

**Key Components:**
- `OrdersPageView.tsx` — page-level container with state management
- `OrdersTable.tsx` — renders the orders data table with status badges

**Orders Table Columns:**

| Column          | Description                         |
| --------------- | ----------------------------------- |
| Order ID        | Unique order identifier             |
| Customer Name   | Customer full name                  |
| Contact Number  | Customer phone number               |
| Payment Method  | GCash or COD                        |
| Items           | Number of ordered items             |
| Total           | Order total amount                  |
| Status          | Current order status with badge     |
| Date            | Order creation date                 |

---

### Order Detail Page — `/orders/[id]`

Full detail view of a specific customer order. Used by the admin to review all order information before taking action.

**Page Sections:**

#### Order Information
- Order ID
- Order creation date
- Current order status (badge)

#### Customer Information
- Customer full name
- Contact number
- Delivery address

#### Order Summary
- Items subtotal
- Total amount
- Payment method

#### Ordered Items Table
- Product name
- Unit price
- Quantity
- Item total

#### Payment Proof
- If the customer uploaded a GCash proof of payment, the image is displayed here for admin review

#### Admin Action Buttons
- **Confirm Order** — Sets order status to `confirmed`
- **Reject Order** — Sets order status to `rejected`
- **Delete Order** — Permanently removes the order (with confirmation)

**Key Component:** `OrderDetailView.tsx`

---

### Dashboard Overview

Accessible as the main metrics section of the admin panel, surfaced in the `DashboardOverview.tsx` component rendered within the authenticated layout.

**Stat Cards Displayed:**

| Stat Card        | Description                                    |
| ---------------- | ---------------------------------------------- |
| Total Products   | Total number of products in the catalog        |
| Low Stock        | Products with stock ≤ 10                       |
| Incoming Orders  | Pending orders awaiting admin action           |
| Confirmed Orders | Orders that have been confirmed                |
| Total Sales      | Revenue sum from confirmed orders              |

**Additional Sections:**

- **Recent Order Activity** — Latest orders (newly placed, confirmed, or rejected)
- **Inventory Watchlist** — Products near depletion or out of stock

**Key Component:** `DashboardOverview.tsx`

---

## Component Inventory

| Component              | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `AdminShell.tsx`       | Overall page layout shell (sidebar + main content area)         |
| `AdminSidebar.tsx`     | Navigation sidebar with Dashboard, Products, Orders, Signout    |
| `AdminTopHeader.tsx`   | Top header bar with page title and user info                    |
| `MobileTopbar.tsx`     | Collapsible mobile navigation bar                               |
| `BrandLogo.tsx`        | Jinshin Brew Reserve brand logo component                       |
| `DashboardOverview.tsx`| Dashboard metrics cards + activity and watchlist sections       |
| `StatCard.tsx`         | Individual metric display card                                  |
| `SectionCard.tsx`      | Reusable card container for dashboard sections                  |
| `ProductsPageView.tsx` | Full products page with search, filter, table, pagination       |
| `ProductTable.tsx`     | Product data table with action buttons                          |
| `ProductFormModal.tsx` | Create/edit product modal form                                  |
| `StockModal.tsx`       | Restock quantity modal                                          |
| `OrdersPageView.tsx`   | Full orders page with search, filter, table, pagination         |
| `OrdersTable.tsx`      | Orders data table with status badges                            |
| `OrderDetailView.tsx`  | Complete order detail page view                                 |
| `StatusBadge.tsx`      | Color-coded order/status badge                                  |
| `Modal.tsx`            | Generic reusable modal wrapper                                  |
| `ConfirmDialog.tsx`    | Reusable confirmation dialog                                    |
| `EmptyState.tsx`       | Empty state placeholder for tables                              |
| `HydrationGuard.tsx`   | Prevents hydration mismatches for client-rendered content       |

---

## State Management

### AuthContext (`context/AuthContext.tsx`)

Manages admin authentication state across the application.

- Stores JWT token in `localStorage` under key: `brew-reserve-admin-token`
- Provides `login()`, `logout()`, and `isAuthenticated` to all child components
- Used by the root layout to guard all protected pages

---

## API Integration

The admin frontend communicates with the backend using a centralized service layer under `services/apis/`.

### Services

| Service         | Backend Endpoint          | Operations                              |
| --------------- | ------------------------- | --------------------------------------- |
| Auth Service    | `/api/v1/auth`            | login, logout, check                    |
| Products Service| `/api/v1/products`        | list, getById, create, update, restock, delete |
| Orders Service  | `/api/v1/orders`          | list, getById, confirm, reject, delete  |
| Dashboard Service | `/api/v1/dashboard`     | getOverview                             |

---

## Environment Variables

| Variable                    | Example Value                     | Description                             |
| --------------------------- | --------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_NODE_ENV`      | `development`                     | Environment mode                        |
| `NEXT_PUBLIC_ST_KEY`        | `brew-reserve-admin-token`        | localStorage key for JWT token          |
| `NEXT_PUBLIC_HOST_URL`      | `http://localhost:3000`           | Admin app base URL                      |
| `NEXT_PUBLIC_API_URL`       | `http://localhost:30011/api/v1`   | Backend API URL (local)                 |
| `NEXT_PUBLIC_PATH_1`        | `/api/v1`                         | Relative API path (for server-side requests via Nginx) |
| `NEXT_PUBLIC_PATH_2`        | `http://backend:3000/api/v1`      | Internal Docker network API URL         |

---

## Navigation Structure

**Sidebar Navigation:**
```
Dashboard
Products
Orders
─────────
Sign Out
```

**Routing:**
```
/login          — Login Page (public)
/               — Redirect to /products
/products       — Products Management
/orders         — Orders List
/orders/[id]    — Order Detail
```

---

## Running Locally

```bash
# Development server (clears .next cache first)
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

The development server runs on `http://0.0.0.0:3000`.

---

## Docker

```yaml
# In docker-compose.yaml
admin:
  build: ./frontend-admin/
  env_file: ./frontend-admin/.env.production
  healthcheck:
    test: curl -fsS http://localhost:3000/admin/login
  restart: unless-stopped
  networks:
    - coffee-network
```

Nginx routes `/admin` → this container.

---

## Functional Sitemap

```
Admin Panel
│
├── [Public]
│   └── /login
│       └── Login Form (username, password)
│
└── [Protected — JWT Required]
    │
    ├── /products
    │   ├── Product Table (image, name, category, price, roast, origin, stock, flags)
    │   ├── Search Bar
    │   ├── Filter Tabs (All | Featured | Best Seller | Low Stock | In Stock | Out of Stock)
    │   ├── Pagination Controls
    │   ├── Create Product Button → ProductFormModal
    │   ├── Edit Product (row action) → ProductFormModal
    │   ├── Restock Product (row action) → StockModal
    │   └── Delete Product (row action) → ConfirmDialog
    │
    ├── /orders
    │   ├── Orders Table (id, name, contact, method, items, total, status, date)
    │   ├── Search Bar
    │   ├── Filter Tabs (All | Pending | Incoming | Confirmed | Rejected)
    │   ├── Pagination Controls
    │   └── Click Row → /orders/[id]
    │
    └── /orders/[id]
        ├── Order Information (id, date, status)
        ├── Customer Information (name, contact, address)
        ├── Order Summary (subtotal, total, payment method)
        ├── Ordered Items Table
        ├── Proof of Payment Image (GCash only)
        └── Admin Actions (Confirm | Reject | Delete)
```

---

## User Experience Goals

- Clean, focused layout optimized for daily admin work
- Quick access to the most important business data
- Consistent table-based workflows for products and orders
- Practical action buttons with confirmation safeguards
- Responsive across common desktop and tablet screen sizes
- Minimal, distraction-free interface for operator efficiency

---

## Summary

The **Frontend Admin** is the operational control panel of the Jinshin Brew Reserve Coffee House platform. It gives the administrator complete control over:

- Product catalog — create, edit, delete, and restock coffee products
- Order management — monitor, search, filter, and act on customer orders
- Dashboard insights — view key metrics including sales, incoming orders, and low-stock alerts
- Secure access — JWT-based authentication protects all admin functionality

Its role is to make daily store management simple, clear, and efficient.
